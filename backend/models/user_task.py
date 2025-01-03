from sqlalchemy import Column, Integer, BigInteger, func, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from models import Base


class UserTask(Base):
    __tablename__ = 'user_task'

    id = Column(Integer, primary_key=True, autoincrement=True)
    status = Column(Integer, default=0, index=True)
    user_id = Column(BigInteger, nullable=False, index=True)
    task_id = Column(Integer, nullable=False, index=True)  # Updated ForeignKey
    created_at = Column(DateTime, default=func.now())

    __table_args__ = (
        UniqueConstraint('user_id', 'task_id', name='_user_task_uc'),  # Ensures unique user-task pair
    )
