import base64
import hashlib
from datetime import datetime
from nacl.utils import random
from nacl.signing import VerifyKey
from nacl.encoding import HexEncoder

from pytonconnect.logger import _LOGGER  # noqa

import config
from core.jwt import create_payload_token
from schemas import WalletInfo


def generate_payload() -> str:
    payload = bytearray(random(8))

    ts = int(datetime.now().timestamp()) + config.TTL
    payload.extend(ts.to_bytes(8, 'big'))

    return create_payload_token(payload=payload.hex())


def check_proof(info_wallet: WalletInfo) -> bool:
    wc, whash = info_wallet.account.address.split(':', maxsplit=2)

    message = bytearray('ton-proof-item-v2/'.encode())
    message.extend(int(wc, 10).to_bytes(4, 'little'))
    message.extend(bytes.fromhex(whash))
    message.extend(info_wallet.proof.domain.lengthBytes.to_bytes(4, 'little'))
    message.extend(info_wallet.proof.domain.value.encode())
    message.extend(info_wallet.proof.timestamp.to_bytes(8, 'little'))
    message.extend(info_wallet.proof.payload.encode())

    signature_message = bytearray.fromhex('ffff') + 'ton-connect'.encode() + hashlib.sha256(message).digest()

    try:
        verify_key = VerifyKey(info_wallet.account.public_key, HexEncoder)  # type: ignore
        verify_key.verify(hashlib.sha256(signature_message).digest(), bytes.fromhex(base64.b64decode(info_wallet.proof.signature).hex()))
        return True
    except Exception as e:
        _LOGGER.error(f"Error verifying signature: {e}")

    return False
