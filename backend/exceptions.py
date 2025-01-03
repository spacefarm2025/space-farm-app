class UserNotFound(Exception):
    def __init__(self, user_id):
        message = f"User with id: {user_id} not founded"
        super().__init__(message)


class InviteNotFound(Exception):
    def __init__(self, invite_id):
        message = f"Invite with id: {invite_id} not founded"
        super().__init__(message)


class NotEnoughBalance(Exception):
    def __init__(self, balance, cost):
        message = f"User balance too low: {balance}/{cost}"
        super().__init__(message)


class NotEnoughEnergy(Exception):
    def __init__(self, energy, cost):
        message = f"User energy too low: {energy}/{cost}"
        super().__init__(message)


class PlantingInPlanetMax(Exception):
    def __init__(self, planet_id):
        message = f"Planting in planet with id: {planet_id} max"
        super().__init__(message)


class ErrorCalculateCostBuild(Exception):
    def __init__(self):
        message = f"Error calculate cost build"
        super().__init__(message)


class BalanceLower(Exception):
    def __init__(self):
        message = f"Balance < 0"
        super().__init__(message)


class ViewNotFound(Exception):
    def __init__(self):
        message = f"View not found"
        super().__init__(message)


class CometNotFound(Exception):
    def __init__(self, comet_id):
        message = f"Comet with id: {comet_id} not found"
        super().__init__(message)


class UserCometNotFound(Exception):
    def __init__(self, comet_id):
        message = f"User comet with id: {comet_id} not found"
        super().__init__(message)


class TokenNotFound(Exception):
    def __init__(self, token_name):
        message = f"Token with name: {token_name} not found"
        super().__init__(message)


class CometTimeExpired(Exception):
    def __init__(self):
        message = f"Time for comet claim expired"
        super().__init__(message)


class CometClaimedBefore(Exception):
    def __init__(self):
        message = f"Comet claimed before"
        super().__init__(message)


class ErrorSeedQuantity(Exception):
    def __init__(self):
        message = f"Seed quantity < 0"
        super().__init__(message)


class WalletNotFound(Exception):
    def __init__(self):
        message = f"Wallet not founded"
        super().__init__(message)


class RateNotFound(Exception):
    def __init__(self):
        message = f"Rate not founded"
        super().__init__(message)


class TaskNotFound(Exception):
    def __init__(self):
        message = "Task not founded"
        super().__init__(message)


class TaskAlreadyStarted(Exception):
    def __init__(self):
        message = "Task already started"
        super().__init__(message)


class TaskNotStarted(Exception):
    def __init__(self):
        message = "Task not started"
        super().__init__(message)


class PlantationNotFound(Exception):
    def __init__(self, plantation_id: int):
        message = f"Plantation with id: {plantation_id} not founded"
        super().__init__(message)


class PlantationAlreadyCharged(Exception):
    def __init__(self, plantation_id: int):
        message = f"Plantation with id: {plantation_id} already charged"
        super().__init__(message)


class PlantationNotCharged(Exception):
    def __init__(self, plantation_id: int):
        message = f"Plantation with id: {plantation_id} not charged"
        super().__init__(message)


class NotEnoughCharge(Exception):
    def __init__(self):
        message = "Not enough charge"
        super().__init__(message)


class PlantationLevelNotFound(Exception):
    def __init__(self):
        message = "Plantation level not found"
        super().__init__(message)


class ErrorMaxChargeForLevel(Exception):
    def __init__(self):
        message = "Plantation for this level have other Max charge"
        super().__init__(message)


class ErrorChargingPlanetId(Exception):
    def __init__(self):
        message = "Error charging with next planet id"
        super().__init__(message)
