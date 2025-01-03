from sqlalchemy import Column, Integer, func, String, DateTime, Text
from sqlalchemy.orm import relationship
from models import Base


class PlantationActions(Base):
    __tablename__ = 'plantation_actions'

    id = Column(Integer, primary_key=True)
    status = Column(Integer, default=0)
    plantation_id = Column(Integer)
    charge = Column(Integer, default=None)
    time_start = Column(DateTime, default=func.now())
    time_finish = Column(DateTime, default=None)

    """
        statuses:
            0 - created
            1 - claimed
           
    """

