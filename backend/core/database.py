import base64
import datetime
import json
import os
import random
from typing import List

import aiogram.types
from sqlalchemy import select, inspect, insert, update, delete, desc, asc
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, load_only
from logger.config import logger

from aiogram import types

from core.setting import Settings
import config
from models import *
from schemas import *
from texts import get_language
from xp_wrapper import xp_admin
from datetime import timedelta
from exceptions import *


def generate_time_now():
    t_time = str(datetime.datetime.now())
    t_time = t_time.split(r'.')[0]
    return t_time


def object_as_dict(obj):
    return {c.key: getattr(obj, c.key)
            for c in inspect(obj).mapper.column_attrs}


class Database:
    def __init__(self):
        self.engine = create_async_engine(Settings().DB_URL, echo=False, future=True)
        self.async_session = sessionmaker(self.engine, class_=AsyncSession, expire_on_commit=False)

    async def connect(self):
        async with self.engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
            return conn

    @staticmethod
    def create_all_tables(bind):
        Base.metadata.create_all(bind)

    async def execute(self, query, params=None):
        async with self.async_session() as session:
            async with session.begin():
                if params:
                    result = await session.execute(query, params)
                else:
                    result = await session.execute(query)
                data = result.all()
                return [row._mapping for row in data]

    async def execute_many(self, query, params_list):
        async with self.async_session() as session:
            async with session.begin():
                results = []
                for params in params_list:
                    result = await session.execute(query, params)
                    data = result.all()
                    results.append([row._mapping for row in data])
                return results

    async def insert(self, table, data):
        stmt = insert(table).values(data)
        async with self.engine.connect() as connection:
            result = await connection.execute(stmt)
            await connection.commit()
            return result.inserted_primary_key[0]

    async def add(self, model):
        async with self.engine.connect() as connection:
            async with self.async_session() as session:
                async with session.begin():
                    session.add(model)
            await connection.commit()

    async def commit(self):
        async with self.engine.connect() as connection:
            await connection.commit()

    async def update(self, table, data, where=None):
        stmt = update(table)
        if where:
            stmt = stmt.where(*where)
        stmt = stmt.values(data)
        async with self.engine.connect() as connection:
            result = await connection.execute(stmt)
            await connection.commit()
            return result.rowcount

    async def delete(self, table, where):
        stmt = delete(table).where(*where)
        async with self.engine.connect() as connection:
            result = await connection.execute(stmt)
            await connection.commit()
            return result.rowcount

    async def close(self):
        await self.engine.dispose()

    '''
    get dict
    
    async def get_data(self, table, where=None, values=None, fetchall=True) -> dict or list[dict] or None:
        if values:
            query = select(*values).select_from(table)
        else:
            query = select(table)
        if where:
            query = query.where(*where)

        async with self.engine.connect() as connection:
            result = await connection.execute(query)
            if fetchall:
                data = result.all()
                return [row._mapping for row in data]
            else:
                row = result.first()
                if row is None:
                    data = None
                else:
                    data = row._mapping
            return data'''

    async def get_data(self, table, where=None, values=None, return_list=False, group_by=None, fetchall=True,
                       limit: int or None = 100,
                       order_by=None, join=None, subquery=None, outerjoin=None, load_only_=None, offset=None,
                       convert_list=None) -> list[Base] or Base or None:
        if values is not None:
            if isinstance(values, (list, tuple)):
                query = select(*values).select_from(table)
            else:
                query = select(values).select_from(table)
        else:
            query = select(table)
        if load_only_ is not None:
            if isinstance(load_only_, (list, tuple)):
                query = query.options(load_only(*load_only_))
            else:
                query = query.options(load_only(load_only_))
        if where:
            query = query.where(*where)
        if group_by is not None:
            query = query.group_by(group_by)
        if order_by is not None:
            query = query.order_by(order_by)
        if join is not None:
            if isinstance(join, (list, tuple)):
                query = query.join(*join)
            else:
                query = query.join(join)
        if outerjoin is not None:
            if isinstance(outerjoin, (list, tuple)):
                query = query.outerjoin(*outerjoin)
            else:
                query = query.outerjoin(outerjoin)
        if limit is not None:
            query = query.limit(limit)
        if offset is not None:
            query = query.offset(offset)
        if subquery:
            query = query.subquery()
            return query
        async with (self.async_session() as session):
            result = await session.execute(query)
            if fetchall:
                if return_list:
                    data = result.fetchall()
                    if convert_list:
                        data = list(list(x) for x in data)
                else:
                    data = result.scalars()
                    if data:
                        data = data.all()
                return data
            else:
                data = result.scalar()

                return data

    async def get_query(self, query: str, fetchall=False, not_return=False):
        async with self.engine.connect() as connection:
            result = await connection.execute(text(query))
            if not_return:
                return result
            if fetchall:
                return result.all()
            else:
                return result.first()

    async def level_up(self, user: User):
        user.level = user.level + 1
        if user.level > 99:
            return
        user.xp_to_next = xp_admin.xp_for_level(level=user.level + 1)
        await self.update(
            table=User,
            data={User.level: user.level,
                  User.xp_to_next: user.xp_to_next,
                  User.energy: user.energy_limit},
            where=[User.id == user.id]
        )
        language = get_language(language=user.language)
        await self.create_message_out(message=None, text=language.level_up(level=user.level),
                                      language_code=user.language,
                                      chat_id=user.id,
                                      message_type="text",
                                      prio=2
                                      )

    @staticmethod
    async def convert_to_base64(message: MessageToSend or types.Message):
        if isinstance(message, MessageToSend):
            message_json = json.dumps(message.__dict__)
        else:
            message_json = json.dumps(message.__dict__, indent=4, sort_keys=True, default=str)
        message_base64 = base64.b64encode(message_json.encode()).decode()
        return message_base64

    async def create_message_out(self, message: types.Message or None, text: str,
                                 reply_markup=None, chat_id=None, message_type=None,
                                 language_code=None, mailing_id: int = None, prio: int = 1,
                                 file_id: str = None) -> MessageOutput:
        message_to_send = MessageToSend(
            chat_id=message.chat.id if not chat_id else chat_id,
            message_type=message_type,
            text=text,
            reply_markup=reply_markup,
            file_id=file_id
        )

        raw_to_send = await self.convert_to_base64(message=message_to_send)

        message_output = MessageOutput(
            chat_id=message.chat.id if not chat_id else chat_id,
            text=text,
            type=message_type,
            language=language_code,
            raw=raw_to_send,
            mailing_id=mailing_id,
            prio=prio
        )
        await self.add_message_output(message_output=message_output)
        return message_output

    async def get_messages_output(self) -> list[MessageOutput] or None:
        messages = await self.get_data(
            table=MessageOutput,
            where=[MessageOutput.status == 0],
            order_by=asc(MessageOutput.prio),
            limit=200
        )
        return messages

    async def add_message_output(self, message_output: MessageOutput):
        await self.add(
            model=message_output
        )

    async def finish_message(self, message_output_id, msg=None, status=1):
        if msg:
            await self.update(
                table=MessageOutput,
                data={
                    MessageOutput.message_id: msg.message_id,
                    MessageOutput.status: status
                },
                where=[
                    MessageOutput.id == message_output_id
                ]
            )
        elif status < 0:
            await self.update(
                table=MessageOutput,
                data={
                    MessageOutput.status: status
                },
                where=[
                    MessageOutput.id == message_output_id
                ]
            )

    async def remove_user(self, user_id):
        await self.delete(table=User, where=[User.id == user_id])

    async def create_message_in(self, kwargs, message, user: User,
                                callback_data=None):
        update_id = kwargs['event_update'].update_id
        raw = await self.convert_to_base64(message=message)
        message_input = MessageInput(
            update_id=update_id,
            status=1,
            message_id=message.message_id,
            chat_id=message.chat.id,
            from_id=message.from_user.id,
            from_first_name=message.from_user.first_name,
            from_username=message.from_user.username,
            from_language_code=user.language,
            type=message.content_type,
            callback_data=callback_data,
            text=message.text,
            raw=raw
        )
        await self.add_message_input(message_input=message_input)

    async def add_message_input(self, message_input: MessageInput):
        await self.add(
            model=message_input
        )

    async def generate_comet(self) -> Comets:
        comets_list = await self.get_data(
            table=Comets,
            where=[Comets.status == 1]
        )
        chances = [comet.chance for comet in comets_list]
        total_chance = sum(chances)

        if total_chance != 100:
            raise ValueError("Загальна сума шансів повинна дорівнювати 100%")
        random_choice = random.choices(comets_list, weights=chances, k=1)[0]
        return random_choice

    async def get_active_tasks(self) -> List[Task]:
        tasks = await self.get_data(
            table=Task,
            where=[Task.status == 1],
            order_by=Task.prio.desc()
        )
        return tasks

    async def take_task(self, task_id: int) -> Task:
        task = await self.get_data(
            table=Task,
            where=[Task.id == task_id],
            fetchall=False
        )
        return task

    async def get_user_task(self, task_id, user_id, auto_create) -> UserTask:
        user_task = await self.get_data(
            table=UserTask,
            where=[UserTask.user_id == user_id,
                   UserTask.task_id == task_id],
            fetchall=False
        )
        if user_task:
            return user_task

        if auto_create:
            task = await self.take_task(task_id=task_id)
            if task:
                if task.query:
                    if "user_id" in task.query:
                        query = task.query.format(user_id=user_id)
                    else:
                        query = task.query
                    result = await self.get_query(query=query, fetchall=False)
                    if result:
                        result = result[0]
                    if result == 1:
                        user_task = UserTask(
                            user_id=user_id,
                            task_id=task_id
                        )
                        await self.add(
                            model=user_task
                        )
                else:
                    user_task = UserTask(
                        user_id=user_id,
                        task_id=task_id
                    )
                    await self.add(
                        model=user_task
                    )
        else:
            user_task = None
        return user_task

    async def load_task_text(self, language, task_id):
        text = await self.get_data(
            table=TaskText,
            where=[
                TaskText.task_id == task_id,
                TaskText.language_id == language
            ],
            fetchall=False
        )
        if not text:
            text = await self.get_data(
                table=TaskText,
                where=[
                    TaskText.task_id == task_id,
                    TaskText.language_id == config.EN
                ],
                fetchall=False
            )
        return text.value if text else None

    @staticmethod
    async def load_task_image(task_id):
        try:
            file_path = f"{config.PHOTO_DIR}{task_id}.{config.PHOTO_FORMAT}"
            if os.path.exists(file_path):
                with open(file_path, "rb") as f:
                    image_data = f.read()
                base64_data = base64.b64encode(image_data).decode()
                return base64_data
            logger.error(f"Error not found {file_path}")
        except Exception as e:
            logger.error(f"Error open photo task with id: {task_id}\nError: {e}")

    async def start_task(self, data: ClickTask):
        user_task = await self.get_user_task(task_id=data.task_id, user_id=data.user_id, auto_create=False)
        if not user_task:
            raise TaskNotFound()
        if user_task.status != config.UserTaskStatuses().CREATED:
            raise TaskAlreadyStarted()
        await self.update(
            table=UserTask,
            data={
                UserTask.status: config.UserTaskStatuses().STARTED
            },
            where=[UserTask.id == user_task.id]
        )
        return True

    async def claim_task(self, data: ClickTask):
        user_task = await self.get_user_task(task_id=data.task_id, user_id=data.user_id, auto_create=False)
        if not user_task:
            raise TaskNotFound()
        if user_task.status != config.UserTaskStatuses().STARTED:
            raise TaskNotStarted()
        await self.update(
            table=UserTask,
            data={
                UserTask.status: config.UserTaskStatuses().FINISHED
            },
            where=[UserTask.id == user_task.id]
        )
        task = await self.take_task(task_id=user_task.task_id)
        modify_data = ModifyBalance(
            user_id=user_task.user_id,
            amount=task.earn_points,
            operation="+"
        )
        await self.modify_balance(modify_data=modify_data)
        await self.add_energy_limit(user_id=modify_data.user_id, add_energy=task.earn_energy)
        return True

    async def add_energy_limit(self, user_id, add_energy):
        await self.update(
            table=User,
            data={User.energy_limit: User.energy_limit + add_energy},
            where=[User.id == user_id]
        )

    async def get_user_tasks(self, user_id: int):
        user = await self.take_user(id_user=user_id)
        if not user:
            raise UserNotFound(user_id=user_id)
        active_tasks = await self.get_active_tasks()
        user_tasks = []
        for task in active_tasks:
            user_task = await self.get_user_task(
                task_id=task.id,
                user_id=user_id,
                auto_create=task.auto_create
            )
            if user_task:
                task_add = {
                    "id": user_task.id,
                    "user_id": user_task.user_id,
                    "task_id": task.id,
                    "prio": task.prio,
                    "earn_points": task.earn_points,
                    "earn_energy": task.earn_energy,
                    "link_redirect": task.link_redirect,
                    "status": user_task.status,
                    "text": await self.load_task_text(task_id=task.id, language=user.language),
                    "image": await self.load_task_image(task_id=task.id)
                }
                user_tasks.append(task_add)
        return user_tasks



    async def get_comet(self, user_id):
        comet_user = await self.get_data(
            table=UserComets,
            where=[UserComets.time_finish > datetime.now(),
                   UserComets.user_id == user_id],
            fetchall=False
        )
        if not comet_user:
            random_comet = await self.generate_comet()
            comet_user = UserComets(
                user_id=user_id,
                comet_id=random_comet.id,
                earn=random_comet.earn
            )
            await self.add(
                model=comet_user
            )
        return comet_user

    async def get_user_wallet(self, user_id: int or str) -> dict:
        tokens = await self.take_tokens()
        wallets = []
        if tokens:
            for token in tokens:
                wallet = await self.get_wallet(
                    user_id=user_id, token_id=token.id
                )
                wallets.append(wallet)
        response = {
            "wallets": wallets,
            "tokens": tokens
        }
        return response

    async def get_wallet(self, user_id: int or str, token_id: int, auto_create: bool = True) -> Wallet:
        wallet = await self.get_data(
            table=Wallet,
            where=[
                Wallet.user_id == user_id,
                Wallet.token_id == token_id
            ],
            fetchall=False
        )
        if not wallet and auto_create:
            wallet = Wallet(
                user_id=user_id,
                token_id=token_id
            )
            await self.add(model=wallet)
        return wallet

    async def take_user_comet(self, comet_id) -> UserComets:
        comet = await self.get_data(
            table=UserComets,
            where=[UserComets.id == comet_id],
            fetchall=False
        )
        return comet

    async def get_comet_for_id(self, comet_id: int) -> Comets:
        comet = await self.get_data(
            table=Comets,
            where=[Comets.id == comet_id],
            fetchall=False
        )
        return comet

    async def claim_comet(self, comet_id) -> UserComets:
        user_comet = await self.take_user_comet(comet_id=comet_id)
        if not user_comet:
            raise UserCometNotFound(comet_id=comet_id)
        if user_comet.status == 0:
            if user_comet.time_claim < datetime.now():
                user_comet.status = -1
            else:
                user_comet.status = 1
            await self.update(
                table=UserComets,
                data={
                    UserComets.status: user_comet.status
                },
                where=[
                    UserComets.id == user_comet.id
                ]
            )
            if user_comet.status == 1:
                comet = await self.get_comet_for_id(comet_id=user_comet.comet_id)
                if not comet:
                    raise CometNotFound(comet_id=comet_id)
                if "Point" in comet.name:
                    earn = comet.earn
                    modify_data = ModifyBalance(
                        user_id=user_comet.user_id,
                        amount=earn,
                        operation="+"
                    )
                    await self.modify_balance(modify_data=modify_data)
                elif "Energy" == comet.name:
                    earn = comet.earn
                    await self.change_energy(operation='+', quantity=earn, user_id=user_comet.user_id)
                else:
                    token = await self.take_token(token_name=comet.name)
                    if not token:
                        raise TokenNotFound(token_name=comet.name)
                    token_id = token.id
                    user_wallet = await self.get_wallet(user_id=user_comet.user_id, token_id=token_id, auto_create=False)
                    user_wallet = await self.modify_user_wallet(user_wallet=user_wallet, amount=comet.earn, operation="+")
                return True
            raise CometTimeExpired()
        raise CometClaimedBefore()


    async def modify_user_wallet(self, user_wallet: Wallet, amount: int or float, operation: str):
        user_wallet.amount = round(float(eval(f"{user_wallet.amount} {operation} {amount}")), 2)
        await self.update(table=Wallet,
                          data={
                              Wallet.amount: user_wallet.amount
                          },
                          where=[
                              Wallet.id == user_wallet.id
                          ])
        return user_wallet

    async def take_tokens(self) -> list[Token]:
        tokens = await self.get_data(
            table=Token,
            limit=None
        )
        return tokens

    async def take_token(self, token_name: str = None, token_id: int = None) -> Token:
        if token_id:
            token = await self.get_data(
                table=Token,
                where=[Token.id == token_id],
                fetchall=False
            )
        else:
            token = await self.get_data(
                table=Token,
                where=[Token.name == token_name],
                fetchall=False
            )
        return token

    async def get_xp_for_plant(self, action: int, plant_id: int, user_id: int or str):
        earn_xp = xp_admin.xp_for_action(action=action, plant_id=plant_id)
        user = await self.take_user(id_user=user_id)
        logger.info(f"earn for action: {action} with plant_id: {plant_id}: {earn_xp}, user: {user}")
        if user:
            user.xp = earn_xp + user.xp
            await self.update(
                table=User,
                data={User.xp: user.xp},
                where=[User.id == user.id]
            )
            if user.xp > user.xp_to_next:
                await self.level_up(user=user)

    async def get_view(self, user_id: int or str, modal_name: str, auto_create=True):
        view = await self.get_data(
            table=Views,
            where=[
                Views.user_id == user_id,
                Views.modal_name == modal_name
            ],
            fetchall=False
        )
        if not view and auto_create:
            view = Views(
                user_id=user_id,
                modal_name=modal_name
            )
            await self.add(
                model=view
            )
        return view

    async def set_view(self, data: UserView):
        view = await self.get_view(user_id=data.user_id, modal_name=data.modal_name, auto_create=False)
        if not view:
            raise ViewNotFound()
        view.status = 1
        await self.update(
            table=Views,
            data={Views.status: view.status},
            where=[Views.id == view.id]
        )
        return view

    async def check_and_update_column_user(self, user_id, column, value):
        old_data = await self.get_data(
            table=User,
            values=column,
            where=[User.id == user_id],
            fetchall=False,
            return_list=True
        )
        if old_data != value:
            await self.update(
                table=User,
                data={
                    column: value,
                },
                where=[
                    User.id == user_id
                ]
            )

    async def create_transaction(self, data: TransactionCreate, kb):
        wallet = await self.get_wallet(user_id=data.user_id, token_id=data.token_id, auto_create=False)
        if not wallet:
            raise WalletNotFound()
        if wallet.amount < data.amount:
            raise NotEnoughBalance(balance=wallet.amount, cost=data.amount)
        wallet.amount = round(wallet.amount - data.amount, 2)
        await self.update(
            table=Wallet,
            data={Wallet.amount: wallet.amount},
            where=[Wallet.id == wallet.id]
        )
        transaction = Transaction(
            user_id=data.user_id,
            token_id=data.token_id,
            amount=data.amount,
            wallet=data.wallet
        )
        await self.add(model=transaction)
        language = get_language()
        user = await self.take_user(id_user=data.user_id)
        reply_markup = kb.convert_to_send_type(
            buttons=kb.transaction(transaction_id=transaction.id),
            keyboard_type=kb.inline
        )
        token = await self.take_token(token_id=data.token_id)
        if not token:
            raise TokenNotFound(token_name=data.token_id)
        await self.create_message_out(message=None, text=language.new_transaction(
                                            user=user,
                                            token_name=token.name,
                                            amount=data.amount,
                                            wallet=data.wallet
                                      ),
                                      language_code=3,
                                      chat_id=config.TRANSACTION_CHANNEL_ID,
                                      message_type="text",
                                      reply_markup=reply_markup
                                      )
        transaction.status = 2
        await self.update_transaction_status(
            status=transaction.status,
            transaction_id=transaction.id
        )
        return transaction

    async def update_transaction_status(self, status, transaction_id):
        await self.update(
            table=Transaction,
            where=[Transaction.id == transaction_id],
            data={Transaction.status: status}
        )

    async def get_views(self, user_id: int or str, country: str = None, platform: str = None):
        views = {}
        for modal_name in config.views_list:
            view = await self.get_view(
                user_id=user_id,
                modal_name=modal_name
            )
            if view:
                views[view.modal_name] = view.status
        if user_id and country is not None:
            await self.check_and_update_column_user(
                user_id=user_id,
                column=User.country,
                value=country
            )
        if user_id and platform is not None:
            platform = platform.strip('"')
            await self.check_and_update_column_user(
                user_id=user_id,
                column=User.platform,
                value=platform
            )
        return views

    async def get_leaderboard(self, user_id: str or int, sort: str, league: int):
        order_by = None
        if league == 0:
            where = []
        else:
            where = [User.level <= int(league * 10), User.level > int((league - 1) * 10)]
        if sort == "xp" or sort == "partners":
            if sort == "xp":
                order_by = desc(User.xp)
            elif sort == "partners":
                order_by = desc(User.refer_count)
        else:
            return None
        user = await self.take_user(id_user=user_id)
        if not user:
            raise UserNotFound(user_id=user_id)
        leaders = await self.get_data(
            table=User,
            order_by=order_by,
            limit=10,
            load_only_=[User.id, User.username, User.balance, User.refer_count, User.xp, User.level],
            where=where
        )
        rankings = await self.get_ranking(
            user_id=user_id,
            order_by=order_by,
            where=where
        )
        info = {
            "rankings": rankings,
            "user": user
        }

        response = {
            "leaders": leaders,
            "info": info
        }

        return response

    async def get_ranking(self, user_id: int or str, order_by, where) -> int:
        subquery = await self.get_data(
            table=User,
            values=[
                func.row_number().over(order_by=order_by).label('rn'),
                User.id
            ],
            subquery=True,
            limit=None,
            where=where
        )
        ranking = await self.get_data(
            table=User,
            values=subquery.c.rn,
            where=[subquery.c.id == user_id],
            fetchall=False
        )
        return ranking

    async def take_user(self, id_user: str or int, country: str = None, platform: str = None) -> User:
        user = await self.get_data(table=User, fetchall=False, where=[User.id == id_user])
        if user:
            user.last_activity = datetime.now()
            await self.update(
                table=User,
                data={
                    User.last_activity: user.last_activity
                },
                where=[
                    User.id == user.id
                ]
            )
            if country:
                if not user.country:
                    await self.check_and_update_column_user(
                        user_id=user.id,
                        column=User.country,
                        value=country
                    )
            if platform:
                if not user.platform:
                    await self.check_and_update_column_user(
                        user_id=user.id,
                        column=User.platform,
                        value=platform
                    )
        return user

    async def take_users(self) -> list[User] or None:
        users = await self.get_data(table=User)
        return users

    async def take_invite_stats(self, only_active: bool) -> list[InviteCode]:
        where = [InviteCode.is_personal == False]
        if only_active:
            where.append(
                InviteCode.time_finish > datetime.now(),
            )
            where.append(
                InviteCode.invites_left > 0
            )
        invites = await self.get_data(
            table=InviteCode,
            where=where
        )
        return invites

    @staticmethod
    async def next_midnight():
        now = datetime.now()
        return datetime(now.year, now.month, now.day, 23, 59, 59)

    async def take_invite_code(self, code) -> InviteCode:
        invite_code = await self.get_data(
            table=InviteCode,
            fetchall=False,
            where=[
                InviteCode.code == code,
                InviteCode.time_finish > datetime.now()
            ]
        )
        return invite_code

    async def take_invite_code_for_id(self, user_id) -> InviteCode:
        invite_code = await self.get_data(
            table=InviteCode,
            fetchall=False,
            where=[
                InviteCode.user_id == user_id,
                InviteCode.time_finish > datetime.now()
            ]
        )
        if not invite_code:
            invite_code = InviteCode(
                user_id=user_id,
                code=await self.generate_invite_code(),
                limit=config.max_invites,
                invites_left=config.max_invites,
                time_finish=await self.next_midnight()
            )
            await self.add(
                model=invite_code
            )
        return invite_code

    async def delete_invite_code(self, data: InviteDelete):
        try:
            await self.delete(
                table=InviteCode,
                where=[
                    InviteCode.id == data.invite_id
                ]
            )
            return True
        except:
            return False

    @staticmethod
    async def generate_invite_code():
        code = ""
        for i in range(12):
            t2 = random.randint(0, 15)
            t2 = hex(t2)[2:]
            t2 = t2.upper()
            code += t2
        return code

    async def create_invite_code(self, data: InviteCodeData):
        invite_code = InviteCode(
            user_id=data.channel_id,
            code=await self.generate_invite_code(),
            name=data.name,
            limit=data.limit,
            invites_left=data.limit,
            is_personal=data.is_personal,
            time_finish=datetime.now() + timedelta(days=356)
        )
        await self.add(
            model=invite_code
        )
        return invite_code

    async def lower_limit_code(self, invite_code: InviteCode):
        await self.update(
            table=InviteCode,
            data={
                InviteCode.invites_left: invite_code.invites_left - 1
            },
            where=[InviteCode.id == invite_code.id]
        )

    async def take_chart_stat_register(self, group, column):
        if column == "register":
            column = User.register_date
        else:
            column = User.last_activity
        if group == "hour":
            values = [
                func.count().label('count'),
                func.date_format(column, '%H').label('register_hour')
            ]
            group_by = func.date_format(column, '%H')
            where = [
                column > datetime.now() - timedelta(days=1)
            ]
        else:
            values = [
                func.count().label('count'),
                func.date_format(column, '%m.%d').label('time')
            ]
            group_by = func.date_format(column, '%m.%d')
            where = [
                column > datetime.now() - timedelta(weeks=4)
            ]
        data = await self.get_data(
            table=User,
            values=values,
            group_by=group_by,
            where=where,
            return_list=True,
            order_by=group_by.asc()
        )
        if data:
            data = list({"name": stat[1], "uv": stat[0]} for stat in data)
        return data

    async def modify_balance(self, modify_data: ModifyBalance) -> User or None:
        user = await self.take_user(id_user=modify_data.user_id)
        if user:
            user.balance = round(float(eval(f"{user.balance} {modify_data.operation} {modify_data.amount}")), 2)
            if user.balance < 0:
                raise BalanceLower()
            await self.update(
                table=User,
                data={
                    User.balance: user.balance
                },
                where=[User.id == user.id]
            )
            return user

    async def update_token(self, user_id: int, token: str) -> User or None:
        user = await self.take_user(id_user=user_id)
        if user:
            user.token = token
            await self.update(
                table=User,
                data={
                    User.token: user.token
                },
                where=[User.id == user.id]
            )
            return user

    async def get_stats_balance(self, middle=False, maximum=False) -> int:
        if middle:
            balance = await self.get_data(
                table=User,
                values=func.avg(User.balance),
                fetchall=False
            )
        elif maximum:
            balance = await self.get_data(
                table=User,
                values=func.max(User.balance),
                fetchall=False
            )
        else:
            balance = -1
        return int(balance)

    async def take_open_invite_no_personal(self):
        invites = await self.get_data(
            table=InviteCode,
            where=[InviteCode.is_personal == 0],
            fetchall=True,
            load_only_=[InviteCode.id, InviteCode.invites_left, InviteCode.code,
                        InviteCode.limit, InviteCode.time_finish, InviteCode.name],
            order_by=desc(InviteCode.created_at)
        )
        return invites

    async def get_refer_count(self, user_id):
        count_refers = await self.get_data(
            table=User,
            where=[User.refer_id == user_id],
            values=func.count(User.id),
            fetchall=False
        )
        return count_refers

    async def get_levels(self):
        levels = await self.get_data(
            table=User,
            values=[func.count(User.id).label('count'),
                    User.level],
            return_list=True,
            group_by=User.level,
            order_by=User.level
        )
        levels = [list(level) for level in levels]
        return levels

    async def confirm_code(self, code) -> list:
        refer_id = None
        invite_code = await self.take_invite_code(code=code)
        logger.error(f"Invite_code: {invite_code}")
        if invite_code:
            invites_left = invite_code.invites_left
            if invites_left > 0:
                await self.lower_limit_code(invite_code=invite_code)
                refer_id = invite_code.user_id if invite_code.is_personal else invite_code.id
        response = [refer_id, 0]
        if refer_id:
            refer = await self.take_user(id_user=refer_id)
            if refer:
                refer.energy_limit = refer.energy_limit + 1
                modify_data = ModifyBalance(
                    user_id=refer_id,
                    amount=config.earn_for_task,
                    operation='+'
                )
                refer.refer_count = refer.refer_count + 1
                await self.update(
                    table=User,
                    data={
                        User.planet: refer.refer_count
                    },
                    where=[User.id == refer.id]
                )
                planets = await self.get_data(
                    table=Planet,
                    where=[Planet.friends_unlock <= refer.refer_count + 1]
                )
                if planets:
                    planet = planets[-1]
                    if refer.planet < planet.id:
                        await self.update(
                            table=User,
                            data={
                                User.planet: planet.id
                            },
                            where=[User.id == refer.id]
                        )
                await self.modify_balance(modify_data=modify_data)
                await self.update(
                    table=User,
                    data={
                        User.energy_limit: refer.energy_limit,
                        User.energy: refer.energy_limit
                    },
                    where=[User.id == refer.id]
                )
                if invite_code.limit > config.max_invites:
                    response = [refer_id, 1500]
        logger.error(f"Invite_code: {refer_id}")
        return response

    async def register(self, message, code=None) -> User or None:
        id_user = message.from_user.id
        user = await self.take_user(id_user=id_user)
        refer_id = None
        add_balance = 0
        if not user:
            if code:
                response = await self.confirm_code(code=code)
                refer_id = response[0]
                add_balance = response[-1]
            first_name = message.from_user.first_name
            username = message.from_user.username
            user = User(
                first_name=first_name,
                username=username,
                refer_id=refer_id,
                id=id_user
            )
            await self.add(user)
            if add_balance:
                modify_data = ModifyBalance(
                    user_id=user.id,
                    operation="+",
                    amount=add_balance
                )
                await self.modify_balance(modify_data=modify_data)
            return user
        else:
            if not user.refer_id:
                if code:
                    response = await self.confirm_code(code=code)
                    refer_id = response[0]
                    add_balance = response[-1]
                    if refer_id:
                        user.refer_id = refer_id
                        user.spins = user.spins + 1
                        await self.update(
                            table=User,
                            data={
                                User.refer_id: user.refer_id,
                                User.spins: user.spins
                            },
                            where=[
                                User.id == user.id
                            ]
                        )
                        if add_balance:
                            modify_data = ModifyBalance(
                                user_id=user.id,
                                operation="+",
                                amount=add_balance
                            )
                            await self.modify_balance(modify_data=modify_data)
                        return user

            return False

    async def register_from_web(self, telegram_user: TelegramUser, startapp: str, kb) -> User or None:
        id_user = telegram_user.id
        user = await self.take_user(id_user=id_user)
        refer_id = None
        add_balance = 0
        if not user:
            if startapp:
                response = await self.confirm_code(code=startapp)
                refer_id = response[0]
                add_balance = response[-1]
            first_name = telegram_user.first_name
            username = telegram_user.username
            user = User(
                first_name=first_name,
                username=username,
                refer_id=refer_id,
                id=id_user
            )
            await self.add(user)
            if add_balance:
                modify_data = ModifyBalance(
                    user_id=user.id,
                    operation="+",
                    amount=add_balance
                )
                await self.modify_balance(modify_data=modify_data)
            language = get_language()
            reply_markup = kb.convert_to_send_type(
                buttons=kb.choose_language(),
                keyboard_type=kb.inline
            )
            await self.create_message_out(message=None, text=language.choose_language(),
                                          language_code=3,
                                          chat_id=user.id,
                                          message_type="text",
                                          reply_markup=reply_markup,
                                          prio=0
                                          )
            return user
        else:
            if not user.refer_id:
                if startapp:
                    response = await self.confirm_code(code=startapp)
                    refer_id = response[0]
                    add_balance = response[-1]
                    if refer_id:
                        user.refer_id = refer_id
                        user.spins = user.spins + 1
                        await self.update(
                            table=User,
                            data={
                                User.refer_id: user.refer_id,
                                User.spins: user.spins
                            },
                            where=[
                                User.id == user.id
                            ]
                        )
                        if add_balance:
                            modify_data = ModifyBalance(
                                user_id=user.id,
                                operation="+",
                                amount=add_balance
                            )
                            await self.modify_balance(modify_data=modify_data)
                        return user
            return False

    async def set_language(self, language_code, id_user):
        await self.update(User, {User.language: language_code}, where=[User.id == id_user])

    async def get_plants(self, plant_id=None) -> list[Plant] or Plant:
        if not plant_id:
            plants = await self.get_data(
                table=Plant
            )
        else:
            plants = await self.get_data(
                table=Plant,
                fetchall=False,
                where=[Plant.id == plant_id]
            )
        return plants

    async def take_count_users(self, minutes=None, hours=None, register=False):
        if hours != 0:
            delta = datetime.now() - timedelta(hours=hours)
        elif minutes != 0:
            delta = datetime.now() - timedelta(minutes=minutes)
        else:
            delta = None
        where = []
        if delta:
            if register:
                where.append(
                    User.register_date > delta
                )
            else:
                where.append(
                    User.last_activity > delta
                )
        count_user = await self.get_data(
            table=User,
            where=where,
            values=func.count(User.id),
            fetchall=False
        )
        return count_user

    async def take_seed(self, user_id, plant_id) -> Seed:
        seed = await self.get_data(
            table=Seed,
            where=[Seed.user_id == user_id, Seed.plant_id == plant_id],
            fetchall=False
        )
        if not seed:
            if plant_id == 1:
                is_lock = False
                cost_unlock = 0
            elif plant_id == 2:
                is_lock = True
                cost_unlock = 2500
            elif plant_id == 3:
                is_lock = True
                cost_unlock = 5000
            else:
                is_lock = False
                cost_unlock = 0
            seed = Seed(
                user_id=user_id,
                plant_id=plant_id,
                is_lock=is_lock,
                cost_unlock=cost_unlock
            )
            await self.add(model=seed)
        return seed

    async def take_seeds(self, user_id) -> list[Seed]:
        plants = await self.get_plants()
        seeds = []
        for plant in plants:
            seeds.append(
                await self.take_seed(user_id=user_id, plant_id=plant.id)
            )
        return seeds

    async def check_energy(self):
        energies = await self.get_data(
            table=User,
            where=[User.energy < User.energy_limit, User.time_energy < datetime.now()]
        )
        if energies:
            for user in energies:
                await self.change_energy(
                    operation='+',
                    quantity=1,
                    user=user
                )

    async def change_energy(self, operation: str, quantity: int = 0, user: User = None, user_id: str or int = None) -> User:
        if not user:
            user = await self.take_user(id_user=user_id)
        if user:
            user.energy = eval(f"{user.energy} {operation} {quantity}")
            if user.energy > user.energy_limit:
                user.energy = user.energy_limit
            elif user.energy < 0:
                user.energy = 0
            await self.update(
                table=User,
                data={
                    User.energy: user.energy
                },
                where=[User.id == user.id]
            )
            if user.energy < user.energy_limit and datetime.now() > user.time_energy:
                user.time_energy = datetime.now() + timedelta(minutes=config.energy_cooldown)
                await self.update(
                    table=User,
                    data={
                        User.time_energy: user.time_energy
                    },
                    where=[User.id == user.id]
                )
            return user

    async def seed_paste(self, seed_data: SeedPaste) -> list[Seed] or None:
        seed = await self.take_seed(user_id=seed_data.user_id, plant_id=seed_data.plant_id)
        if seed.quantity > 0:
            user = await self.take_user(id_user=seed_data.user_id)
            if user:
                if user.energy >= config.energy_actions.get('seed'):
                    planting = await self.take_planting(seed_data.plantation_id)
                    if planting:
                        plant = await self.get_plants(plant_id=seed_data.plant_id)
                        if plant:
                            grow_time = plant.grow_time
                            planting.plant_id = seed_data.plant_id
                            planting.harvest_time = datetime.now() + timedelta(minutes=grow_time)
                            planting.time_seed = datetime.now()
                            planting.grow_stage = 1

                            modify_data = ModifySeed(
                                user_id=seed_data.user_id,
                                plant_id=seed_data.plant_id,
                                quantity=1,
                                operation='-'
                            )
                            await self.modify_seed(modify_data=modify_data)
                            await self.change_energy(
                                operation='-',
                                user=user,
                                quantity=2
                            )
                            await self.update(
                                table=Planting,
                                data={
                                    Planting.plant_id: planting.plant_id,
                                    Planting.harvest_time: planting.harvest_time,
                                    Planting.grow_stage: planting.grow_stage,
                                    Planting.time_seed: planting.time_seed
                                },
                                where=[Planting.id == planting.id]
                            )
                            await self.get_xp_for_plant(action=1, plant_id=plant.id, user_id=planting.user_id)
        seeds = await self.take_seeds(user_id=seed_data.user_id)
        return seeds

    async def harvest(self, planting_id: int) -> Planting:
        planting = await self.take_planting(planting_id=planting_id)
        if planting:
            plant_id = planting.plant_id
            if plant_id:
                plant = await self.get_plants(plant_id=plant_id)
                if plant:
                    user_id = planting.user_id
                    user = await self.take_user(id_user=user_id)
                    if user:
                        if user.energy >= config.energy_actions.get('harvest'):

                            # Час збирання
                            harvest_time = planting.harvest_time

                            if harvest_time < datetime.now():
                                earn = plant.tokens
                                await self.change_energy(
                                    operation='-',
                                    user=user,
                                    quantity=1
                                )
                                planting.time_water = datetime.now()
                                planting.harvest_time = None
                                planting.time_seed = None
                                planting.grow_stage = None
                                planting.plant_id = None
                                await self.update(
                                    table=Planting,
                                    data={
                                        Planting.time_water: planting.time_water,
                                        Planting.harvest_time: planting.harvest_time,
                                        Planting.time_seed: planting.time_seed,
                                        Planting.grow_stage: planting.grow_stage,
                                        Planting.plant_id: planting.plant_id
                                    },
                                    where=[
                                        Planting.id == planting.id
                                    ]
                                )
                                modify_data = ModifyBalance(
                                    user_id=user.id,
                                    operation="+",
                                    amount=earn
                                )
                                await self.modify_balance(modify_data=modify_data)
                                await self.get_xp_for_plant(action=3, plant_id=plant.id, user_id=planting.user_id)

        return planting

    async def watering(self, planting_id: int) -> Planting:
        planting = await self.take_planting(planting_id=planting_id)
        if planting:
            plant_id = planting.plant_id
            if plant_id:
                plant = await self.get_plants(plant_id=plant_id)
                if plant:
                    user_id = planting.user_id
                    user = await self.take_user(id_user=user_id)
                    if user:
                        if user.energy >= config.energy_actions.get('watering'):
                            time_water = planting.time_water
                            if time_water < datetime.now():
                                waters = plant.waters
                                time_seed = planting.time_seed

                                harvest_time = planting.harvest_time
                                total_watering_time = (harvest_time - time_seed).seconds / 60

                                time_between_waterings = total_watering_time / waters

                                planting.time_water = datetime.now() + timedelta(minutes=time_between_waterings)
                                planting.harvest_time -= timedelta(seconds=int(total_watering_time/2*60))
                                await self.update(
                                    table=Planting,
                                    data={
                                        Planting.time_water: planting.time_water,
                                        Planting.harvest_time: planting.harvest_time
                                    },
                                    where=[
                                        Planting.id == planting.id
                                    ]
                                )
                                await self.change_energy(
                                    operation='-',
                                    user=user,
                                    quantity=1
                                )
                                await self.get_xp_for_plant(action=2, plant_id=plant.id, user_id=user_id)
        return planting

    async def take_plantings(self, user_id, planet_id: int = None) -> list[Planting] or list[ChargeResponse]:
        if planet_id:
            plantings = await self.take_plantings_for_planet(user_id=user_id, planet_id=planet_id)
            return plantings
        plantings = await self.get_data(
            table=Planting,
            where=[Planting.user_id == user_id]
        )
        return plantings

    async def take_plantings_for_planet(self, user_id, planet_id) -> list[ChargeResponse]:
        from repositories import PlantationRepository
        if planet_id != 3:
            raise ErrorChargingPlanetId()
        plantings = await self.get_data(
            table=Planting,
            where=[Planting.user_id == user_id,
                   Planting.planet_id == planet_id]
        )
        response = []
        repository = PlantationRepository(db=self)
        for planting in plantings:
            action = await repository.get_active_charge(plantation_id=planting.id)
            if action:
                charge = action.charge
                time_start = action.time_start
                time_finish = action.time_finish
            else:
                charge = 0
                time_start = None
                time_finish = None
            response_row = ChargeResponse(
                id=planting.id,
                time_start=time_start,
                time_finish=time_finish,
                charge=charge
            )
            response.append(response_row)
        return response

    async def take_planting(self, planting_id) -> Planting:
        plantings = await self.get_data(
            table=Planting,
            where=[Planting.id == planting_id],
            fetchall=False
        )
        return plantings

    async def take_planting_in_planet(self, build: BuildPlantingNew) -> int:
        plantings = await self.get_data(
            table=Planting,
            where=[Planting.user_id == build.user_id,
                   Planting.planet_id == build.planet_id],
            values=func.count(Planting.id),
            fetchall=False
        )
        return plantings

    async def take_planets(self, planet_id = None) -> list[Planet] or Planet:
        if planet_id:
            where = [Planet.id == planet_id]
            fetchall = False
        else:
            where=None
            fetchall = True
        planets = await self.get_data(
            table=Planet,
            where=where,
            fetchall=fetchall
        )
        return planets

    async def calculate_cost_planting(self, build: BuildPlantingNew):
        planet = await self.take_planets(planet_id=build.planet_id)
        if planet:
            plantings_in_planet = await self.take_planting_in_planet(build=build)
            if plantings_in_planet >= 3:
                raise PlantingInPlanetMax(planet_id=build.planet_id)
            new_planting = plantings_in_planet + 1
            cost = config.coef_build.get(new_planting)
            if cost:
                cost = int(cost * config.base_price_build * planet.boost)
                return cost
        raise ErrorCalculateCostBuild()

    async def build_planting_v2(self, build: BuildPlantingNew) -> dict:
        user = await self.take_user(id_user=build.user_id)
        if user:
            if user.energy < config.energy_actions['build']:
                raise NotEnoughEnergy(energy=user.energy, cost=config.energy_actions['build'])
            cost = await self.calculate_cost_planting(build=build)
            if user.balance < cost:
                raise NotEnoughBalance(balance=user.balance, cost=cost)
            modify_data = ModifyBalance(
                user_id=user.id,
                operation="-",
                amount=cost
            )
            await self.modify_balance(modify_data=modify_data)
            await self.change_energy(
                operation='-',
                user=user,
                quantity=config.energy_actions['build']
            )
            planting = Planting(
                user_id=user.id,
                planet_id=build.planet_id
            )
            await self.add(
                model=planting
            )
            plantings = await self.take_plantings(user_id=user.id)
            response = {
                "plantings": plantings,
                "user": user
            }
            return response
        else:
            raise UserNotFound(user_id=build.user_id)

    async def build_planting(self, build: BuildPlanting) -> Planting or None:
        user = await self.take_user(id_user=build.user_id)
        if user:
            balance = user.balance
            if balance >= build.price and user.energy >= build.energy:
                modify_data = ModifyBalance(
                    user_id=user.id,
                    operation="-",
                    amount=build.price
                )
                await self.modify_balance(modify_data=modify_data)
                await self.change_energy(
                    operation='-',
                    user=user,
                    quantity=build.energy
                )
                planting = Planting(
                    user_id=user.id,
                )
                await self.add(
                    model=planting
                )
                plantings = await self.take_plantings(user_id=user.id)
                response = {
                    "plantings": plantings,
                    "user": user
                }
                return response

    async def subscribe_confirm(self, user_id):

        user = await self.take_user(id_user=user_id)
        await self.update(
            table=User,
            data={
                User.subscribe_channel: True
            },
            where=[
                User.id == user.id
            ]
        )
        await self.change_energy(
            operation='+',
            quantity=user.energy_limit,
            user_id=user_id
        )
        modify_data = ModifyBalance(
            user_id=user.id,
            operation="+",
            amount=config.earn_for_task
        )
        await self.modify_balance(modify_data=modify_data)

    async def modify_seed(self, modify_data: ModifySeed):
        seed = await self.take_seed(user_id=modify_data.user_id, plant_id=modify_data.plant_id)
        user = await self.take_user(id_user=modify_data.user_id)
        if user:
            seed.quantity = int(eval(f"{seed.quantity} {modify_data.operation} {modify_data.quantity}"))
            if seed.quantity < 0:
                raise ErrorSeedQuantity()
            if modify_data.operation == "+":
                plant = await self.get_plants(plant_id=seed.plant_id)
                await self.modify_balance(modify_data=ModifyBalance(
                    user_id=modify_data.user_id,
                    amount=int(plant.price * modify_data.quantity),
                    operation="-"
                ))
            await self.update(
                table=Seed,
                data={
                    Seed.quantity: seed.quantity
                },
                where=[Seed.id == seed.id]
            )

        return seed

    async def unlock_seed(self, modify_data: UnlockSeed):
        seed = await self.take_seed(user_id=modify_data.user_id, plant_id=modify_data.plant_id)
        user = await self.take_user(id_user=modify_data.user_id)
        if user:
            if seed.is_lock:
                if user.balance >= seed.cost_unlock:
                    modify_balance = ModifyBalance(
                        user_id=user.id,
                        amount=seed.cost_unlock,
                        operation='-'
                    )
                    await self.modify_balance(modify_data=modify_balance)
                    seed.is_lock = False
                    await self.update(
                        table=Seed,
                        data={
                            Seed.is_lock: seed.is_lock
                        },
                        where=[
                            Seed.id == seed.id
                        ]
                    )
        return seed

    async def take_open_mailing(self):
        mailing = await self.get_data(
            table=Mailing,
            where=[Mailing.status == 2],
            fetchall=False
        )
        return mailing

    async def get_users_to_send(self, query, page, limit=1000):
        query = f"{query} LIMIT {limit} OFFSET {(page - 1) * limit}"
        result = await self.get_query(query=query, fetchall=True)
        return result

    async def update_mailing_users(self, mailing: Mailing):
        await self.update(
            table=Mailing,
            data={
                Mailing.users: mailing.users,
            },
            where=[
                Mailing.id == mailing.id
            ]
        )

    async def set_mailing_users(self, mailing: Mailing):
        mailing.time_finish = datetime.now()
        await self.update(
            table=Mailing,
            data={
                Mailing.users: mailing.users,
                Mailing.status: mailing.status,
                Mailing.time_finish: mailing.time_finish
            },
            where=[
                Mailing.id == mailing.id
            ]
        )


async def get_db() -> Database:
    db = Database()
    try:
        yield db
    finally:
        await db.close()
