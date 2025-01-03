import asyncio
import base64
import json
import time

from aiogram.exceptions import TelegramBadRequest, TelegramForbiddenError
from aiogram.client.bot import DefaultBotProperties
from aiogram.types import ContentType
from aiogram import Bot

from keyboards import Keyboards
from models.models import MessageToSend
from core import Database
from logger import logger
import config

bot = Bot(token=config.TOKEN,
          default=DefaultBotProperties(parse_mode='HTML'))
kb = Keyboards()


def decode_message(message_base64) -> MessageToSend:
    try:
        message_json = json.loads(base64.b64decode(message_base64).decode())
        message = MessageToSend(**message_json)
        return message
    except Exception as e:
        logger.error(f"Error create MessageToSend object: {e}")


async def main():
    db = Database()
    await db.connect()
    threads = 4
    logger.info(f"Running for {threads} threads")
    while True:
        messages = await db.get_messages_output()
        if messages:
            split_messages = [messages[i::threads] for i in range(threads)]
            tasks = []
            for _messages in split_messages:
                task = asyncio.create_task(process_messages(db, _messages))
                tasks.append(task)
            await asyncio.gather(*tasks)
        else:
            time.sleep(0.4)
        time.sleep(0.1)


async def process_messages(db, messages):
    for message in messages:
        try:
            message_to_send = decode_message(message_base64=message.raw)
            if message_to_send:
                reply_markup = message_to_send.reply_markup

                if reply_markup:
                    kb_type = reply_markup.get('type')
                    if kb_type == kb.inline:
                        reply_markup = kb.generate_inline_markup(buttons=reply_markup.get('buttons'))
                    else:
                        reply_markup = kb.generate_reply_markup(buttons=reply_markup.get('buttons'))
                if message_to_send.message_type == ContentType.TEXT:

                    msg = await bot.send_message(
                        message_to_send.chat_id,
                        message_to_send.text,
                        reply_markup=reply_markup,
                        parse_mode=message_to_send.parse_mode,
                    )
                    await db.finish_message(message_output_id=message.id, msg=msg)
                    #  sender_logger.info(f"Message sending complete")
                elif message_to_send.message_type == ContentType.PHOTO:
                    file_id = message_to_send.file_id
                    msg = await bot.send_photo(
                        chat_id=message_to_send.chat_id,
                        photo=file_id,
                        caption=message_to_send.text,
                        reply_markup=reply_markup,
                        parse_mode=message_to_send.parse_mode,
                    )
                    await db.finish_message(message_output_id=message.id, msg=msg)
                else:
                    logger.error(f"unkown type")
                    status = -2
                    await db.finish_message(message_output_id=message.id, status=status)
        except TelegramForbiddenError as e:
            if "bot was blocked by the user" in str(e):
                logger.error(f"Bot was blocked by the user")
                status = -3
                await db.finish_message(message_output_id=message.id, status=status)
            else:
                logger.error(f"Error sending message: {e}")
                status = -1
                await db.finish_message(message_output_id=message.id, status=status)
        except TelegramBadRequest as e:
            if "chat not found" in str(e):
                if message.prio == 0:
                    try:
                        await db.remove_user(user_id=message_to_send.chat_id)
                    except Exception as e:
                        logger.error(f"error delete user: {e}")
                logger.error(f"Bot was blocked by the user")
                status = -4
                await db.finish_message(message_output_id=message.id, status=status)
            else:
                logger.error(f"Error sending message: {e}")
                status = -1
                await db.finish_message(message_output_id=message.id, status=status)
        except Exception as e:
            logger.error(f"Error sending message: {e}")
            status = -1
            await db.finish_message(message_output_id=message.id, status=status)

if __name__ == "__main__":
    asyncio.run(main())
