import hashlib
import hmac
from nacl.utils import random
from pytonapi import AsyncTonapi

import config
import tg_bot
from fastapi import FastAPI, Query, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import asyncio
import uvicorn
import re

from core.jwt import verify_token, create_auth_token, decode_auth_token
from exceptions import *
from repositories import PlantationRepository, MailingRepository, ExchangeRateRepository, InviteRepository
from schemas import *
from logger import logger
from keyboards import Keyboards
import config as cf

from tonconnect.proof import generate_payload, check_proof

admin_kb = Keyboards()
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
db = tg_bot.db


async def take_user_data_from_headers(request: Request):
    headers = request.headers
    platform = headers.get('sec-ch-ua-platform')
    if not platform:
        ua = headers.get('user-agent')
        if re.search(r'iPhone|iPad|iPod', ua):
            platform = 'IOS'
        elif re.search(r'Macintosh', ua):
            platform = 'MacOS'
        if not platform:
            ua_split = ua.split(';')
            if len(ua_split) > 2:
                platform = ua_split[1]
                platform = re.sub(' ', '', platform)
                if "Android" in platform:
                    platform = "Android"
            else:
                platform = ua[:100]
    country = headers.get('cf-ipcountry')
    ip = headers.get('x-forwarded-for')
    is_mobile = headers.get('sec-ch-ua-mobile')
    response = {
        "platform": platform,
        "country": country,
        "ip": ip,
        "is_mobile": is_mobile
    }
    logger.info(f"response: {response} | headers: {headers}")
    return response


"""
    START User endpoints
"""

""" OLD """


@app.post("/api/v1/user/get")
async def read_root(data: GetUser):
    user = await db.take_user(id_user=data.user_id)
    if user:
        return user
    else:
        return {}


@app.post("/api/v1/user/subscribe")
async def subscribe_check(data: GetUser):
    result = await tg_bot.is_join_channel(user_id=data.user_id)
    return result


@app.get("/api/v1/invite/get")
async def take_invite_code(user_id: str = Query(..., description="user_id to check")):
    invite_code = await db.take_invite_code_for_id(user_id=user_id)
    return invite_code


@app.post("/api/v1/seeds/get")
async def read_root(user: GetUser):
    seeds = await db.take_seeds(user_id=user.user_id)
    if seeds:

        return seeds
    else:
        return []


@app.post("/api/v1/plantings/get")
async def read_root(user: GetUser):
    plantings = await db.take_plantings(user_id=user.user_id)
    if plantings:
        return plantings
    else:
        return []


@app.post("/api/v1/user/balance/modify")
async def modify_balance(modify_data: ModifyBalance):
    user = await db.modify_balance(modify_data=modify_data)
    if user:
        return user
    else:
        return {}

""" NEW """


@app.get('/api/v1/user/wallet')
async def take_user_wallet(user_id: str = Query(..., description="UserID")):
    try:
        response = {
            "status": 1,
            "data": await db.get_user_wallet(user_id=user_id)
        }
    except Exception as e:
        response = {
            "status": 0,
            "data": str(e)
        }
    return response


@app.get("/api/v1/leaderboard")
async def subscribe_check(user_id: str = Query(..., description="UserId"),
                          sort: str = Query('xp', description="sorting"),
                          league: int = Query(..., description="league")
                          ):
    result = await db.get_leaderboard(user_id=user_id, sort=sort, league=league)
    return result


@app.get("/api/v1/user/views")
async def get_user_views(user_id: str = Query(..., description="UserId")):
    result = await db.get_views(user_id=user_id)
    return result


@app.get("/api/v1/user/comet")
async def get_user_views(user_id: str = Query(..., description="UserId")):
    try:
        result = await db.get_comet(user_id=user_id)
        response = {
            "status": 1,
            "data": result
        }
    except Exception as error:
        response = {
            "status": 0,
            "data": str(error)
        }
    return response


@app.put("/api/v1/user/comet/claim")
async def claim_comet(data: CometClaim):
    try:
        result = await db.claim_comet(comet_id=data.comet_id)
        response = {
            "status": 1,
            "data": result
        }
    except Exception as error:
        response = {
            "status": 0,
            "data": str(error)
        }
    return response


@app.post("/api/v1/user/view")
async def set_user_view(data: UserView):
    try:
        result = await db.set_view(data=data)
        response = {
            "status": 1,
            "data": result
        }
    except Exception as error:
        response = {
            "status": 0,
            "data": str(error)
        }
    return response


@app.get("/api/v1/user/get")
async def read_root(request: Request,
                    user_id: str = Query(..., description="UserId")):
    user_data = await take_user_data_from_headers(request=request)
    country = user_data.get('country')
    platform = user_data.get('platform')
    user = await db.take_user(id_user=user_id, country=country, platform=platform)
    # user = await db.take_user(id_user=user_id)
    if user:
        return user
    else:
        return {}


@app.get("/api/v1/user/subscribe")
async def subscribe_check(user_id: str = Query(..., description="UserId")):
    result = await tg_bot.is_join_channel(user_id=user_id)
    return result


@app.get("/api/v1/user/invite")
async def take_invite_code(user_id: str = Query(..., description="user_id to check")):
    invite_code = await db.take_invite_code_for_id(user_id=user_id)
    return invite_code


@app.get("/api/v1/user/seeds")
async def read_root(user_id: str = Query(..., description="user_id to check")):
    seeds = await db.take_seeds(user_id=user_id)
    if seeds:

        return seeds
    else:
        return []


@app.get("/api/v1/user/plantings")
async def read_root(user_id: str = Query(..., description="user_id to check"),
                    planet_id: int = Query(default=None, description="Planet id")):
    plantings = await db.take_plantings(user_id=user_id, planet_id=planet_id)
    if plantings:
        return plantings
    else:
        return []


@app.post("/api/v1/user/transaction/create")
async def create_transaction(data: TransactionCreate):
    response = await db.create_transaction(data=data, kb=admin_kb)
    return response


@app.post("/api/v1/user/transaction/create")
async def create_transaction(data: TransactionCreate):
    response = await db.create_transaction(data=data, kb=admin_kb)
    return response


from urllib.parse import unquote


def validate_telegram_webapp(init_data: str) -> bool:
    # Крок 1: Генеруємо секретний ключ
    secret_key = hmac.new(key=bytes(config.TOKEN, 'utf-8'), msg=b"WebAppData", digestmod=hashlib.sha256).digest()
    print(f"Secret Key: {secret_key.hex()}")  # Виведення секретного ключа

    # Декодуємо init_data, щоб замінити всі URL-кодовані символи
    init_data = unquote(init_data)
    print(f"Decoded init_data: {init_data}")  # Виведення декодованого init_data

    # Розбиваємо init_data на окремі поля та їх значення
    params = dict(param.split('=') for param in init_data.split('&'))
    print(f"Params: {params}")  # Виведення параметрів

    # Витягуємо hash
    received_hash = params.pop('hash', None)
    print(f"Received Hash: {received_hash}")  # Виведення отриманого хеша

    if not received_hash:
        return False

    # Крок 2: Формуємо рядок із параметрів для перевірки (data_check_string)
    data_check_string = '\n'.join(f"{key}={value}" for key, value in sorted(params.items()))
    print(f"Data Check String: {data_check_string}")  # Виведення data_check_string

    # Генеруємо підпис для перевірки даних
    calculated_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
    print(f"Calculated Hash: {calculated_hash}")  # Виведення обчисленого хеша

    # Крок 3: Порівнюємо отриманий hash з обчисленим
    if not hmac.compare_digest(received_hash, calculated_hash):
        print("Hash mismatch!")  # Виведення, якщо хеші не співпадають
        return False


    return True


def verify_telegram_init_data(request: Request):
    init_data = request.headers.get("InitData", "")
    received_hash = request.headers.get("Hash", "")

    if not init_data:
        raise HTTPException(status_code=400, detail="Missing Telegram init data")

    if not validate_telegram_webapp(init_data):
        raise HTTPException(status_code=400, detail="Invalid Telegram WebApp data")

    # Повертаємо initData якщо все ок
    return True


# Ендпоінт для прийому запитів з валідацією через Depends
@app.post("/api/v1/user/register")
async def validate_telegram_webapp_data(data: UserRegister):
    user = await db.register_from_web(telegram_user=data.user, startapp=data.startapp, kb=Keyboards())
    return user

"""
    END user endpoint
    
    START Admin endpoint
"""


@app.post("/api/v1/invite/create")
async def change_limit(data: CreateInvite):
    repository = InviteRepository(db=db)
    response = await repository.generate_invite_for_ads(name=data.name)
    return response


@app.post("/api/v1/invite/limit/change")
async def change_limit(data: ChangeLimit):
    repository = InviteRepository(db=db)
    response = await repository.change_limit(invite_id=data.invite_id, limit=data.change)
    return response


@app.post("/api/v1/invite/time/change")
async def change_time(data: ChangeTime):
    repository = InviteRepository(db=db)
    response = await repository.extend_expiration(invite_id=data.invite_id, days=data.days)
    return response


@app.get("/api/v1/mailings")
async def get_mailings():
    repository = MailingRepository(db=db)
    mailings = await repository.get_mailings()
    return mailings


@app.post("/api/v1/mailing")
async def get_mailings(data: MailingAdd):
    repository = MailingRepository(db=db)
    mailings = await repository.add_mailing(data=data)
    return mailings


@app.get("/api/v1/admin/chart/register")
async def get_stats(group: str = Query("hour"), column: str = Query("register")):
    result = await db.take_chart_stat_register(group=group, column=column)
    return result


@app.get("/api/v1/stats/users")
async def take_stats_users(minutes: int = Query(None), hours: int = Query(None), register: bool = Query(False)):
    count_users = await db.take_count_users(minutes=minutes, hours=hours, register=register)
    return count_users


@app.get("/api/v1/stats/levels")
async def take_stats_users():
    levels = await db.get_levels()
    print(levels)
    return levels


@app.get("/api/v1/stats/balance")
async def take_stats_balance(middle: bool = Query(None), maximum: bool = Query(None)):
    balance = await db.get_stats_balance(middle=middle, maximum=maximum)
    return balance


@app.get("/api/v1/stats/invites")
async def take_invite_codes():
    invites = await db.take_open_invite_no_personal()
    return invites

"""
    END Admin endpoint
    
    START task endpoint
    
"""


@app.get("/api/v1/user/tasks")
async def get_user_tasks(user_id: int = Query(...)):
    user_tasks = await db.get_user_tasks(user_id=user_id)
    return user_tasks


@app.post("/api/v1/user/task/start")
async def start_task(data: ClickTask):
    response = await db.start_task(data=data)
    response = await db.start_task(data=data)
    return response


@app.post("/api/v1/user/task/claim")
async def start_task(data: ClickTask):
    response = await db.claim_task(data=data)
    return response


"""
    END task endpoint

    START Plant endpoint
"""


""" OLD """


@app.post("/api/v1/plants/get")
async def read_root():
    plants = await db.get_plants()
    return plants

""" New """


@app.get("/api/v1/plants")
async def read_root():
    plants = await db.get_plants()
    return plants

"""
    END Plant endpoint
    
    START exchange
"""


@app.get("/api/v1/rate")
async def get_exchange_rate(from_id: int = Query(...), to_id: int = Query(...)):
    rate = await ExchangeRateRepository(db=db).get_rate(from_id=from_id, to_id=to_id)
    return rate


@app.post("/api/v1/swap")
async def get_exchange_rate(data: Swap):
    rate = await ExchangeRateRepository(db=db).swap(data=data)
    return rate


"""
    END exchange
    
    START Planting endpoint
"""


""" OLD """


@app.post("/api/v1/plantings/build")
async def read_root(build: BuildPlanting):
    response = await db.build_planting(build=build)
    if response:
        return response
    else:
        return {}


@app.post("/api/v1/plantings/watering")
async def watering(data: PlantingWithId):
    planting = await db.watering(planting_id=data.planting_id)
    return planting


@app.post("/api/v1/plantings/harvest")
async def watering(data: PlantingWithId):
    planting = await db.harvest(planting_id=data.planting_id)
    return planting


@app.post("/api/v1/seeds/paste")
async def read_root(seed_data: SeedPaste):
    seeds = await db.seed_paste(seed_data=seed_data)
    if seeds:
        response = {
            "seeds": seeds,
            "plantings": await db.take_plantings(user_id=seed_data.user_id),
            "user": await db.take_user(id_user=seed_data.user_id)
        }
        return response
    else:
        return []

""" NEW """


@app.post("/api/v1/planting/charge")
async def watering(data: ChargePlantation):
    plantation_action_repository = await PlantationRepository(db=db).charging_plantation(data=data)
    return plantation_action_repository


@app.post("/api/v1/planting/claim")
async def watering(data: ClaimPlantation):
    plantation_action_repository = await PlantationRepository(db=db).claim_charge(plantation_id=data.plantation_id)
    return plantation_action_repository


@app.post("/api/v1/planting/watering")
async def watering(data: PlantingWithId):
    planting = await db.watering(planting_id=data.planting_id)
    response = {
        "planting": planting,
        "user": await db.take_user(id_user=planting.user_id) if planting else None
    }
    return response


@app.post("/api/v1/planting/harvest")
async def watering(data: PlantingWithId):
    planting = await db.harvest(planting_id=data.planting_id)
    response = {
        "planting": planting,
        "user": await db.take_user(id_user=planting.user_id) if planting else None
    }
    return response


@app.post("/api/v1/planting/build")
async def read_root(build: BuildPlantingNew):
    try:
        response = {
            "status": 1,
            "data": await db.build_planting_v2(build=build)
        }
    except (NotEnoughEnergy, NotEnoughBalance, UserNotFound, ErrorCalculateCostBuild, PlantingInPlanetMax) as error:
        response = {
            "status": 0,
            "data": str(error)
        }
    return response


@app.post("/api/v1/planting/build/calculate")
async def read_root(build: BuildPlantingNew):
    try:
        response = {
            "status": 1,
            "data": await db.calculate_cost_planting(build=build)
        }
    except (ErrorCalculateCostBuild, PlantingInPlanetMax) as error:
        response = {
            "status": 0,
            "data": str(error)
        }
    return response


@app.post("/api/v1/planting/seed")
async def read_root(seed_data: SeedPaste):
    seeds = await db.seed_paste(seed_data=seed_data)
    if seeds:
        response = {
            "seeds": seeds,
            "plantings": await db.take_plantings(user_id=seed_data.user_id),
            "user": await db.take_user(id_user=seed_data.user_id)
        }
        return response
    else:
        return []

"""
    END Planting endpoint

    START Seed endpoint
"""


@app.post("/api/v1/seed/modify")
async def modify_seed(modify_data: ModifySeed):
    seed = await db.modify_seed(modify_data=modify_data)
    user = await db.take_user(id_user=modify_data.user_id)
    response = {
        "user": user,
        "seed": seed,
        "seeds": await db.take_seeds(user_id=modify_data.user_id)
    }
    return response


@app.post("/api/v1/seed/unlock")
async def modify_seed(modify_data: UnlockSeed):
    seed = await db.unlock_seed(modify_data=modify_data)
    user = await db.take_user(id_user=modify_data.user_id)
    response = {
        "user": user,
        "seed": seed,
        "seeds": await db.take_seeds(user_id=modify_data.user_id)
    }
    return response


"""
    END Seed endpoint
    
    START Ton Connect endpoint
"""


@app.post("/api/v1/generate_payload")
async def post_generate_payload():

    return {
        "payload": generate_payload()
    }


@app.post("/api/v1/check_proof")
async def post_check_proof(wallet_info: WalletInfo):
    if check_proof(wallet_info):
        if verify_token(wallet_info.proof.payload):
            token = create_auth_token(address=wallet_info.account.address, network=wallet_info.account.chain)
            await db.update_token(wallet_info.user_id, token)

            return {"token": token}

        else:
            return {"error": "Invalid token"}

    else:
        return {'error': "Invalid proof"}


@app.post("/api/v1/get_account_info")
async def get_account_info(request: Request):
    print(request.headers)
    token = request.headers.get("Authorization").replace('Bearer ', '')

    if data := decode_auth_token(token):
        tonapi: AsyncTonapi = request.app.tonapi

        return await tonapi.accounts.get_info(data['address'])


"""
    END Ton Connect endpoint
"""


@app.exception_handler(Exception)
async def ex_wrapper(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "status": 0,
            "data": str(exc)
        }
    )


async def run_fast_api():
    tonapi = AsyncTonapi(api_key=cf.TONAPI_KEY)
    app.tonapi = tonapi

    config = uvicorn.Config(app, host="0.0.0.0", port=cf.api['port'])
    server = uvicorn.Server(config)
    await server.serve()


if __name__ == "__main__":
    asyncio.run(run_fast_api())
