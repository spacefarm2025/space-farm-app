from core import Database
from exceptions import UserNotFound, WalletNotFound, RateNotFound, NotEnoughBalance
from models import ExchangeRate
from schemas import ModifyBalance, Swap


class ExchangeRateRepository:
    def __init__(self, db: Database):
        self.db = db
        self.table = ExchangeRate

    async def get_rate(self, from_id: int, to_id: int) -> float:
        response = await self.db.get_data(
            table=self.table,
            where=[
                self.table.currency_from == from_id,
                self.table.currency_to == to_id
            ],
            fetchall=False
        )
        if response:
            return response.rate
        return response

    async def swap(self, data: Swap):
        user = await self.db.take_user(id_user=data.user_id)
        if not user:
            raise UserNotFound(user_id=data.user_id)
        user_wallet = await self.db.get_wallet(user_id=data.user_id, token_id=data.from_id, auto_create=False)
        if not user_wallet:
            raise WalletNotFound()
        rate = await self.get_rate(from_id=data.from_id, to_id=data.to_id)
        if not rate:
            raise RateNotFound()
        if user_wallet.amount < data.amount:
            raise NotEnoughBalance(balance=user_wallet.amount, cost=data.amount)
        await self.db.modify_user_wallet(user_wallet=user_wallet, amount=data.amount, operation="-")
        earn = round(float(eval(f"{rate} * {data.amount}")), 2)
        if data.to_id != 0:
            user_wallet = await self.db.get_wallet(user_id=data.user_id, token_id=data.to_id, auto_create=True)
            await self.db.modify_user_wallet(user_wallet=user_wallet, amount=earn, operation="+")
        else:
            modify_data = ModifyBalance(
                user_id=data.user_id,
                amount=earn,
                operation="+"
            )
            await self.db.modify_balance(modify_data=modify_data)
        return True
