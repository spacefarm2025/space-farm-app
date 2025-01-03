from sqlalchemy import Column, Integer, BigInteger, String, DateTime, Text, Boolean
from sqlalchemy.orm import relationship
from models import Base


class Task(Base):
    __tablename__ = 'tasks'  # Ensure this matches the ForeignKey in UserTask and TaskText

    id = Column(BigInteger, primary_key=True, index=True)
    status = Column(Integer, default=0)
    prio = Column(Integer)
    earn_points = Column(Integer)
    earn_energy = Column(Integer)
    link_redirect = Column(String(255))
    auto_create = Column(Boolean, default=True)
    query = Column(Text)
    time = Column(DateTime, default=None)

