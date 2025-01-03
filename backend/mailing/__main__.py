import asyncio
import json

from core import Database
from logger import logger
from keyboards import Keyboards


async def mailing_wrapper():
    while True:
        db = Database()
        mailing = await db.take_open_mailing()
        kb = Keyboards()
        if mailing:
            logger.info(f"Start mailing: id: {mailing.id}")
            mailing.users = 0
            count = 0
            limit = mailing.limit
            query = mailing.query
            text = mailing.text
            reply_markup = mailing.keyboard
            page = 1
            status = 1
            if reply_markup:
                reply_markup = json.loads(str(reply_markup))
            while True:
                try:
                    users_to_send = await db.get_users_to_send(query=query, page=page)
                    logger.info(f"Users to send in page {page}: {len(users_to_send)}")
                    if users_to_send and (limit is None or limit > 0):
                        page += 1
                        for user in users_to_send:
                            if "{name}" in text:
                                if len(user) > 2:
                                    first_name = user[2]
                                else:
                                    first_name = ""
                                text_to_send = text.format(name=first_name)
                            else:
                                text_to_send = text

                            await db.create_message_out(message=None, text=text_to_send,
                                                        language_code=user[1],
                                                        chat_id=user[0],
                                                        message_type=mailing.type,
                                                        reply_markup=reply_markup,
                                                        prio=10,
                                                        mailing_id=mailing.id,
                                                        file_id=mailing.file_id
                                                        )
                            count += 1
                            if limit is not None and count >= limit:
                                break
                    else:
                        break
                    mailing.users = count
                    await db.update_mailing_users(mailing=mailing)
                except Exception as e:
                    logger.error(f"Error sending to users in page {page} | Error: {e}")
                    status = -1
                    break
            mailing.status = status
            await db.set_mailing_users(mailing=mailing)
        else:
            logger.info("Mailing not founded")
        await db.close()
        await asyncio.sleep(60)


if __name__ == "__main__":
    asyncio.run(mailing_wrapper())
