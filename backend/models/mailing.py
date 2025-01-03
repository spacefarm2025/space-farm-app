from sqlalchemy import Column, Integer, func, String, DateTime, Text
from sqlalchemy.orm import relationship
from models import Base


class Mailing(Base):
    __tablename__ = 'mailings'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), default=None)
    status = Column(Integer, default=0)
    users = Column(Integer, default=0)
    text = Column(Text, default=None)
    file_id = Column(Text, default=None)
    type = Column(String(100), default=None)
    keyboard = Column(Text, default=None)
    query = Column(Text, default=None)
    limit = Column(Integer, default=None)
    utm = Column(Text, default=None)
    time = Column(DateTime, default=func.now())
    time_start = Column(DateTime, default=func.now())
    time_finish = Column(DateTime, default=None)

    """
        statuses:
            0 - created
            1 - creating records finished and running
            2 - creating records
            3 - sending finished
            -1 - error
    """

