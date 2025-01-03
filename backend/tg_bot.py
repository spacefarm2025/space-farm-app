import sys
import asyncio
import logging
from aiogram import types, F
from aiogram.enums import ContentType
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram import Bot, Dispatcher, Router
from aiogram.fsm.state import State, StatesGroup
from aiogram.fsm.context import FSMContext
from aiogram.filters import CommandStart
from aiogram.client.bot import DefaultBotProperties
from aiogram.exceptions import TelegramBadRequest
from apscheduler.triggers.cron import CronTrigger

from keyboards import Keyboards, get_language
from apscheduler.schedulers.asyncio import AsyncIOScheduler

from logger import logger
from stats import fill_hour_stats
from core import Database
import config


db = Database()
dp = Dispatcher(storage=MemoryStorage())
form_router = Router()
kb = Keyboards()
bot = Bot(token=config.TOKEN,
          default=DefaultBotProperties(parse_mode='HTML'))


async def is_join_channel(user_id):
    try:
        response = await bot.get_chat_member(chat_id=config.channel_id, user_id=user_id)
        if response.status != "left":
            user = await db.take_user(id_user=user_id)
            if not user.subscribe_channel:
                await db.subscribe_confirm(user_id=user_id)
            return True
        else:
            return False
    except TelegramBadRequest:
        return False


class States(StatesGroup):
    name = State()
    like_bots = State()
    language = State()


def get_name_with_link(user=None, user_username=None, user_name=None):
    if user:
        user_name = user.get('first_name')
        user_username = user.get('username')
    if user_username:
        user_name = f'<a href="t.me/{user_username}">{user_name}</a>'
    return user_name


class HandlerUser:
    def __init__(self, id_user, call=None, message: types.Message = None, state=None, **kwargs):
        self.state = state
        self.message = message
        self.id_user = id_user
        self.language = get_language()
        self.user = None
        self.kb = Keyboards()
        self.call = call
        self.kwargs = kwargs
        if self.call:
            self.states = self.call.data.split('_')
        else:
            self.states = None

    async def connect(self):
        self.user = await db.take_user(id_user=self.id_user)
        if self.user:
            try:
                await db.create_message_in(kwargs=self.kwargs, message=self.message if self.message else self.call.message,
                                           user=self.user, callback_data=self.call.data if self.call else None)
            except Exception as e:
                logger.error(str(e))
            self.language = get_language(language=self.user.language)
            self.kb = Keyboards(language=self.user.language)
            if not self.user.language:
                if self.call:
                    if self.states[0] != "language":
                        return True
                else:
                    return True

    async def reply_file_id(self):
        await db.create_message_out(message=None, text=self.message.photo[-1].file_id,
                                    language_code=config.EN,
                                    chat_id=self.id_user,
                                    message_type="text",
                                    )

    async def handler_start(self):
        if self.message.content_type == ContentType.PHOTO:
            file_id = self.message.photo[-1].file_id
            await self.message.answer(text=str(file_id))
            return
        code = None
        if " " in self.message.text:
            code = self.message.text.split(" ")[1]
        if not self.user:
            user = await db.register(message=self.message, code=code)
            if user.refer_id:
                refer = await db.take_user(id_user=user.refer_id)
                if refer:
                    language = refer.language
                    language = get_language(language=language)
                    user_name = get_name_with_link(user_name=self.message.from_user.first_name,
                                                   user_username=self.message.from_user.username)
                    msg = language.new_partner(refer_username=user_name)
                    await db.create_message_out(message=None, text=msg,
                                                language_code=refer.language,
                                                chat_id=user.refer_id,
                                                message_type="text",
                                                )
                    #  await bot.send_message(user.refer_id, msg)
            await self.connect()
        if self.user:
            user = await db.register(message=self.message, code=code)
            if user:
                self.user = user
            if not self.user.language:
                await self.send_choose_language()
            else:
                if code and not self.user.refer_id:
                    await db.create_message_out(message=None, text=self.language.all_codes_used(),
                                                language_code=self.user.language,
                                                chat_id=self.user.id,
                                                message_type="text",
                                                )
                    #  await bot.send_message(self.user.id, self.language.all_codes_used())
                else:
                    await self.starting_bot()
                #
                # if self.user.refer_id:
                #     await self.starting_bot()
                # else:
                #     if code:
                #         await bot.send_message(self.user.id, self.language.all_codes_used())
                #     else:
                #         await bot.send_message(self.user.id, self.language.only_invite())

    async def starting_bot(self):
        reply_markup = self.kb.convert_to_send_type(
            buttons=self.kb.home(user=self.user),
            keyboard_type=self.kb.inline
        )
        await db.create_message_out(message=None, text=self.language.home_menu(),
                                    language_code=self.user.language,
                                    chat_id=self.user.id,
                                    message_type="text",
                                    reply_markup=reply_markup
                                    )
        # await bot.send_message(self.id_user, self.language.home_menu(),
        #                        reply_markup=self.kb.home(user=self.user))

    async def transaction_wrapper(self):
        if len(self.states) == 3:
            if self.states[2] == "confirm":
                await db.update_transaction_status(
                    status=1,
                    transaction_id=self.states[1]
                )
                await self.edit_via_call(
                    text=self.call.message.text + "\n" + self.language.confirm()
                )
            else:
                await db.update_transaction_status(
                    status=2,
                    transaction_id=self.states[1]
                )
                await self.edit_via_call(
                    text=self.call.message.text + "\n" + self.language.cancel()
                )

    async def send_choose_language(self):
        reply_markup = self.kb.convert_to_send_type(
            buttons=self.kb.choose_language(),
            keyboard_type=self.kb.inline
        )
        await db.create_message_out(message=None, text=self.language.choose_language(),
                                    language_code=self.user.language,
                                    chat_id=self.user.id,
                                    message_type="text",
                                    reply_markup=reply_markup
                                    )
        # await bot.send_message(self.id_user, self.language.choose_language(),
        #                        reply_markup=self.kb.choose_language())

    async def callback_manager(self):
        if self.states:
            first_state = self.states[0]
            if first_state == "language":
                await self.set_language()
            elif first_state == "lang":
                await self.send_choose_language()
            elif first_state == "transaction":
                await self.transaction_wrapper()

    async def edit_via_call(self, text=None, reply_markup=None):
        if not text:
            text = self.call.message.text
        await bot.edit_message_text(
            chat_id=self.call.message.chat.id,
            message_id=self.call.message.message_id,
            text=text,
            reply_markup=reply_markup
        )

    async def set_language(self):
        language = self.states[1]
        if language == 'en':
            language_code = 2
        elif language == 'ru':
            language_code = 1
        elif language == "ua":
            language_code = 3
        else:
            language_code = 3
        await db.set_language(language_code=language_code, id_user=self.id_user)
        await self.connect()
        await self.edit_via_call(text=self.language.new_language_set())
        await self.starting_bot()


# Хендлер на команду /start
@form_router.message(CommandStart())
async def start_command(message: types.Message, **kwargs):
    handler = HandlerUser(id_user=message.from_user.id, message=message, **kwargs)
    nothing_language = await handler.connect()
    await handler.handler_start()


@form_router.callback_query()
async def process_callback_button1(callback_query: types.CallbackQuery, state: FSMContext, **kwargs):
    handler = HandlerUser(id_user=callback_query.from_user.id, call=callback_query, state=state, **kwargs)
    nothing_language = await handler.connect()
    if nothing_language:
        await handler.send_choose_language()
    else:
        await handler.callback_manager()


# Хендлер на наступний крок (отримання імені)
@form_router.message()
async def get_name(message: types.Message, state: FSMContext, **kwargs):
    handler = HandlerUser(id_user=message.from_user.id, message=message, state=state, **kwargs)
    nothing_language = await handler.connect()
    if nothing_language:
        await handler.send_choose_language()
    else:
        await handler.handler_start()


async def scheduler():
    scheduler = AsyncIOScheduler()
    logger.info(f"start scheduller")
    scheduler.add_job(db.check_energy, 'interval', seconds=1)
    scheduler.add_job(
        fill_hour_stats,
        trigger=CronTrigger(minute="00", hour="*"),
        args=(db,))
    scheduler.start()
    logger.info(f"start scheduller")


async def main():
    await db.connect()
    asyncio.get_event_loop().create_task(scheduler())
    #  await send_mail()
    #  input("finish mail?")
    logger_names = ['apscheduler.executors', 'apscheduler', 'apscheduler.jobstores']
    for name in logger_names:
        logger = logging.getLogger(name)
        logger.setLevel(logging.CRITICAL)
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    dp.include_router(form_router)
    await bot.delete_webhook()
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
