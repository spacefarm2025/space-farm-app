from sqlalchemy import Column, Integer, Text, func, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from models import Base


class TaskText(Base):
    __tablename__ = 'task_texts'

    id = Column(Integer, primary_key=True, autoincrement=True)
    language_id = Column(Integer, index=True, nullable=False)
    task_id = Column(Integer, nullable=False, index=True)  # Updated ForeignKey
    value = Column(Text, nullable=False)
    created_at = Column(DateTime, default=func.now())

    __table_args__ = (
        UniqueConstraint('task_id', 'language_id', name='_task_language_uc'),  # Ensures unique task-language pair
    )
