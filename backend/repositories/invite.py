from core import Database
from models import InviteCode
from datetime import timedelta

from exceptions import InviteNotFound

from schemas import InviteCodeData


class InviteRepository:
    def __init__(self, db: Database):
        self.db = db
        self.table = InviteCode

        self.DEFAULT_LIMIT = 1000

    async def get_invite(self, invite_id: int) -> InviteCode:
        invite = await self.db.get_data(
            table=InviteCode,
            where=[InviteCode.id == invite_id],
            fetchall=False
        )
        return invite

    async def generate_invite_for_ads(self, name) -> bool:
        data = InviteCodeData(
            channel_id=1,
            name=name,
            limit=self.DEFAULT_LIMIT,
            is_personal=False
        )
        await self.db.create_invite_code(data=data)
        return True

    async def change_limit(self,  invite_id: int, limit: int = None):
        invite = await self.get_invite(invite_id=invite_id)
        if not invite:
            raise InviteNotFound(invite_id=invite_id)
        if not limit:
            limit = self.DEFAULT_LIMIT
        await self.db.update(
            table=InviteCode,
            data={
                InviteCode.limit: InviteCode.limit + limit,
                InviteCode.invites_left: InviteCode.invites_left + limit
            },
            where=[InviteCode.id == invite_id]
        )

    async def extend_expiration(self, invite_id: int, days: int = 30):
        invite = await self.get_invite(invite_id=invite_id)
        if not invite:
            raise InviteNotFound(invite_id=invite_id)

        new_expiration_date = invite.time_finish + timedelta(days=days)

        await self.db.update(
            table=InviteCode,
            data={
                InviteCode.time_finish: new_expiration_date
            },
            where=[InviteCode.id == invite_id]
        )

