from sqlalchemy import Column, Integer, BigInteger, Text, String, DateTime, ForeignKey, Boolean, Float, func, text
from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy.ext.declarative import declarative_base

from xp_wrapper import xp_admin

Base = declarative_base()


class User(Base):
    __tablename__ = 'users'

    id = Column(BigInteger, primary_key=True, index=True)
    first_name = Column(String(100))
    username = Column(String(100), unique=True)
    register_date = Column(DateTime, default=datetime.utcnow)
    last_activity = Column(DateTime, default=datetime.utcnow)
    refer_id = Column(BigInteger, ForeignKey("users.id"))
    energy = Column(Integer, default=10)
    energy_limit = Column(Integer, default=10)
    is_admin = Column(Boolean, default=False)
    language = Column(Integer, default=None)
    balance = Column(Float, default=1500)
    planet = Column(Integer, default=1)
    level = Column(Integer, default=1)
    xp = Column(Integer, default=0)
    xp_to_next = Column(Integer, default=xp_admin.xp_for_level(level=2))
    refer_count = Column(Integer, default=0)
    time_energy = Column(DateTime, default=datetime.utcnow)
    subscribe_channel = Column(Boolean, default=False)
    spins = Column(Integer, default=0)
    country = Column(String(10), default=None)
    platform = Column(String(100), default=None)
    token = Column(String(256), default=None)

    plantings = relationship("Planting", back_populates="user")


class MessageToSend:
    def __init__(self, chat_id, message_type, text=None, caption=None,
                 file_id=None, reply_markup=None, parse_mode='HTML', **args):
        self.chat_id = chat_id
        self.text = text
        self.message_type = message_type
        self.caption = caption
        self.file_id = file_id
        self.reply_markup = reply_markup
        self.parse_mode = parse_mode
        self.args = args


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    status = Column(Integer, default=0, index=True)
    user_id = Column(BigInteger)
    token_id = Column(Integer)
    amount = Column(Float)
    wallet = Column(String(100))
    time_create = Column(DateTime, default=func.now())
    time_finish = Column(DateTime, default=None)


class MessageOutput(Base):
    __tablename__ = 'msg_out'

    id = Column(Integer, primary_key=True, autoincrement=True)
    status = Column(Integer, default=0, index=True)
    prio = Column(Integer)
    mailing_id = Column(Integer, default=None)
    message_id = Column(Integer, default=None)
    chat_id = Column(String(20))
    language = Column(String(10))
    type = Column(String(255), default="text")
    text = Column(Text)
    raw = Column(Text)
    time = Column(DateTime, default=func.now())


class MessageInput(Base):
    __tablename__ = 'msg_in'

    id = Column(Integer, primary_key=True, autoincrement=True)
    status = Column(Integer, default=0, index=True)
    update_id = Column(BigInteger)
    message_id = Column(Integer)
    chat_id = Column(String(20))
    from_id = Column(String(20))
    from_first_name = Column(String(255))
    from_username = Column(String(255))
    from_language_code = Column(Integer)
    type = Column(String(255))
    callback_data = Column(String(255))
    text = Column(Text)
    raw = Column(Text)
    time = Column(DateTime, default=func.now())


class Planet(Base):
    __tablename__ = 'planets'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    friends_unlock = Column(Integer, default=1)
    boost = Column(Integer)


class Plant(Base):
    __tablename__ = 'plants'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    planet_id = Column(Integer, nullable=False)
    price = Column(Integer)
    grow_time = Column(Integer)
    tokens = Column(Integer)
    waters = Column(Integer)


class InviteCode(Base):
    __tablename__ = 'invite_codes'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger)
    code = Column(String(100), index=True)
    name = Column(String(100), default=None)
    limit = Column(Integer)
    invites_left = Column(Integer)
    is_personal = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    time_finish = Column(DateTime)


class Seed(Base):
    __tablename__ = 'seeds'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(BigInteger, ForeignKey("users.id"))
    plant_id = Column(Integer, ForeignKey("plants.id"))
    quantity = Column(Integer, default=0)
    is_lock = Column(Boolean)
    cost_unlock = Column(Integer)


class Comets(Base):
    __tablename__ = "comets"

    id = Column(Integer, primary_key=True, index=True)
    status = Column(Integer)
    name = Column(String(100))
    chance = Column(Float)
    earn = Column(Float)
    time = Column(DateTime, default=func.now())


class UserComets(Base):
    __tablename__ = "user_comets"

    id = Column(Integer, primary_key=True, index=True)
    status = Column(Integer, default=0)
    user_id = Column(BigInteger)
    comet_id = Column(Integer)
    earn = Column(Float)
    time_start = Column(DateTime, default=func.now())
    time_finish = Column(DateTime, default=text("NOW() + INTERVAL 10 SECOND"))
    time_claim = Column(DateTime, default=text("NOW() + INTERVAL 60 SECOND"))


class Views(Base):
    __tablename__ = "views"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(BigInteger)
    status = Column(Integer, default=0)
    modal_name = Column(String(100))
    time = Column(DateTime, default=func.now())


class Planting(Base):
    __tablename__ = 'plantings'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(BigInteger, ForeignKey("users.id"))
    plant_id = Column(Integer, ForeignKey("plants.id"), default=None)
    planet_id = Column(Integer, nullable=False)
    grow_stage = Column(Integer, default=None)
    level = Column(Integer, default=1)
    harvest_time = Column(DateTime, default=None)
    time_water = Column(DateTime, default=func.now())
    time_seed = Column(DateTime, default=None)

    user = relationship("User", back_populates="plantings")
    plant = relationship("Plant")


class Token(Base):
    __tablename__ = 'tokens'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    status = Column(Integer)


class Wallet(Base):
    __tablename__ = 'wallets'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(BigInteger)
    token_id = Column(Integer)
    amount = Column(Float, default=0)
    status = Column(Integer, default=1)
    time = Column(DateTime, default=func.now())


# class Task(Base):
#     __tablename__ = 'tasks'
#
#     id = Column(Integer, primary_key=True, index=True)
#     description = Column(String(1000))
#     reward = Column(Integer)
#
#
# class UserTask(Base):
#     __tablename__ = 'user_tasks'
#
#     id = Column(Integer, primary_key=True, index=True)
#     user_id = Column(Integer, ForeignKey("users.id"))
#     task_id = Column(Integer, ForeignKey("tasks.id"))
#     completed = Column(Boolean, default=False)
#
#     user = relationship("User", back_populates="tasks")
#     task = relationship("Task")


"""    
# у перспективі
class Plantation(Base):
    __tablename__ = 'plantations'

    id = Column(Integer, primary_key=True, index=True)
    size = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User")
    plantings = relationship("Planting", back_populates="plantation")
"""
