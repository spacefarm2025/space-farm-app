import datetime
import json

from core import Database
from models import Mailing
from keyboards import Keyboards

from schemas import MailingAdd


class MailingRepository:
    def __init__(self, db: Database):
        self.db = db
        self.table = Mailing

        self.STATUS_ACTIVE = 2
        self.STATUS_FINISH = 1
        self.DEFAULT_QUERY = "SELECT users.id, users.language, users.first_name FROM users"

        self.EN = "EN"
        self.UA = "UA"
        self.RU = "RU"

        self.EN_CODE = 2
        self.UA_CODE = 3
        self.RU_CODE = 1

    async def get_mailings(self) -> list[Mailing]:
        mailings = await self.db.get_data(
            table=Mailing
        )
        return mailings

    async def add_mailing(self, data: MailingAdd):
        where = " WHERE "
        if data.language == self.EN:
            code = self.EN_CODE
            where += f"users.language is NULL OR users.language = {code}"
        elif data.language == self.RU:
            code = self.RU_CODE
            where += f"users.language = {code}"
        elif data.language == self.UA:
            code = self.UA_CODE
            where += f"users.language = {code}"
        else:
            code = self.EN_CODE
            where += f"users.language is NULL OR users.language = {code}"
        kb = Keyboards(language=code)
        reply_markup = json.dumps(kb.convert_to_send_type(
            buttons=kb.farm(),
            keyboard_type=kb.inline
        ))
        query = self.DEFAULT_QUERY + where
        mailing = Mailing(
            name=data.name,
            query=query,
            text=data.text,
            file_id=data.file_id,
            type=data.type,
            status=self.STATUS_ACTIVE,
            keyboard=reply_markup
        )
        await self.db.add(model=mailing)
