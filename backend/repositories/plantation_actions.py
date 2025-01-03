import datetime

from core import Database
from exceptions import PlantationNotFound, PlantationAlreadyCharged, UserNotFound, NotEnoughCharge, \
    PlantationLevelNotFound, ErrorMaxChargeForLevel, ErrorChargingPlanetId, TokenNotFound
from models import PlantationActions
from schemas import ChargePlantation


class PlantationRepository:
    def __init__(self, db: Database):
        self.db = db
        self.table = PlantationActions

        self.STATUS_ACTIVE = 0
        self.STATUS_FINISH = 1
        self.CHARGE_MARS = 20
        self.TOKEN_NAME = "Liquid"

    async def get_active_charge(self, plantation_id: int) -> PlantationActions:
        response = await self.db.get_data(
            table=self.table,
            where=[
                self.table.plantation_id == plantation_id,
                self.table.status == self.STATUS_ACTIVE
            ],
            fetchall=False
        )
        return response

    async def charging_plantation(self, data: ChargePlantation):
        plantation = await self.db.take_planting(data.plantation_id)
        if not plantation:
            raise PlantationNotFound(plantation_id=data.plantation_id)
        active_charge = await self.get_active_charge(plantation_id=data.plantation_id)
        if active_charge:
            raise PlantationAlreadyCharged(plantation_id=data.plantation_id)
        user = await self.db.take_user(id_user=plantation.user_id)
        if not user:
            raise UserNotFound(user_id=plantation.user_id)
        if plantation.planet_id == 3:
            charge = user.energy
            if charge < data.charge:
                raise NotEnoughCharge()
            if plantation.level == 1:
                max_charge = 6
            elif plantation.level == 2:
                max_charge = 9
            elif plantation.level == 3:
                max_charge = 12
            else:
                raise PlantationLevelNotFound()
            if max_charge < data.charge:
                raise ErrorMaxChargeForLevel()
            time_start = datetime.datetime.now()
            time_finish = time_start + datetime.timedelta(minutes=int(self.CHARGE_MARS * data.charge))
            await self.db.change_energy(
                operation="-",
                quantity=data.charge,
                user=user
            )
            plantation_action = PlantationActions(
                plantation_id=plantation.id,
                charge=data.charge,
                time_start=time_start,
                time_finish=time_finish
            )
            await self.db.add(model=plantation_action)
            return True
        else:
            raise ErrorChargingPlanetId()

    async def claim_charge(self, plantation_id):
        plantation = await self.db.take_planting(plantation_id)
        if not plantation:
            raise PlantationNotFound(plantation_id=plantation_id)
        active_charge = await self.get_active_charge(plantation_id=plantation_id)
        if not active_charge:
            raise PlantationAlreadyCharged(plantation_id=plantation_id)
        user = await self.db.take_user(id_user=plantation.user_id)
        if not user:
            raise UserNotFound(user_id=plantation.user_id)
        if plantation.planet_id == 3:
            charge = active_charge.charge
            if charge == 0:
                raise NotEnoughCharge()
            token = await self.db.take_token(token_name=self.TOKEN_NAME)
            if not token:
                raise TokenNotFound(token_name=self.TOKEN_NAME)
            token_id = token.id
            user_wallet = await self.db.get_wallet(user_id=plantation.user_id, token_id=token_id, auto_create=True)
            await self.db.update(
                table=self.table,
                data={
                    self.table.status: self.STATUS_FINISH
                },
                where={
                    self.table.id == active_charge.id
                }
            )
            await self.db.modify_user_wallet(user_wallet=user_wallet, amount=charge, operation="+")
            return True
        else:
            raise ErrorChargingPlanetId()
