from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field, constr, conint
from typing import Union


class GetUser(BaseModel):
    user_id: Union[str, int]


class SeedPaste(BaseModel):
    user_id: Union[str, int]
    plant_id: int
    plantation_id: int


class BuildPlanting(BaseModel):
    user_id: Union[str, int]
    price: float
    energy: int


class BuildPlantingNew(BaseModel):
    user_id: Union[str, int]
    planet_id: int


class ModifyBalance(BaseModel):
    user_id: Union[str, int]
    amount: Union[str, float, int]
    operation: str


class ModifySeed(BaseModel):
    user_id: Union[str, int]
    plant_id: Union[str, int]
    quantity: int
    operation: str


class Swap(BaseModel):
    from_id: int
    to_id: int
    amount: float
    user_id: int


class UnlockSeed(BaseModel):
    user_id: Union[str, int]
    plant_id: Union[str, int]


class PlantingWithId(BaseModel):
    planting_id: int


class InviteCodeData(BaseModel):
    channel_id: Union[str, int]
    name: str
    limit: int
    is_personal: bool = True


class InviteDelete(BaseModel):
    invite_id: int


class UserView(BaseModel):
    user_id: Union[str, int]
    modal_name: str


class ChangeLimit(BaseModel):
    invite_id: int
    change: int


class CreateInvite(BaseModel):
    name: str


class ChangeTime(BaseModel):
    invite_id: int
    days: int


class CometClaim(BaseModel):
    comet_id: int


class TransactionCreate(BaseModel):
    user_id: int
    token_id: int
    amount: float
    wallet: str


class ClickTask(BaseModel):
    task_id: int
    user_id: int


class ChargePlantation(BaseModel):
    charge: int
    plantation_id: int


class ClaimPlantation(BaseModel):
    plantation_id: int


class ChargeResponse(BaseModel):
    id: int
    charge: int
    time_start: Union[datetime, None]
    time_finish: Union[datetime, None]


class MailingAdd(BaseModel):
    text: str
    type: str
    name: str
    file_id: str = None
    language: str


class TelegramUser(BaseModel):
    id: int
    username: str
    first_name: str
    language_code: str


class UserRegister(BaseModel):
    user: TelegramUser
    startapp: str


class AccountWallet(BaseModel):
    address: str
    state_init: str
    public_key: str
    chain: str


class Domain(BaseModel):
    lengthBytes: int
    value: str


class TonProof(BaseModel):
    timestamp: int
    domain: Domain
    signature: str
    payload: str


class WalletInfo(BaseModel):
    user_id: int
    account: AccountWallet
    proof: TonProof
