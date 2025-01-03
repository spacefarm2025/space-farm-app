from sqlalchemy import Column, Integer, func, String, DateTime, Float, Text, ForeignKey
from sqlalchemy.orm import relationship
from models import Base


class ExchangeRate(Base):
    __tablename__ = 'exchange_rates'

    id = Column(Integer, primary_key=True)
    currency_from = Column(Integer, nullable=False)
    currency_to = Column(Integer, nullable=False)
    rate = Column(Float, nullable=False)
    time = Column(DateTime, default=func.now(), nullable=False)

