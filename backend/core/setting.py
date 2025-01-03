from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    user: str = "root"
    password: str = "Kiadra2024"
    host: str = "localhost"
    db_name: str = "space_farm"

    DB_URL: str = f"mysql+aiomysql://{user}:{password}@{host}/{db_name}"

    class Config:
        case_sensitive = True


settings = Settings()
