import config


class UaLanguage:
    def __init__(self):
        super().__init__()
        self.name = "🚀🌾 Space Farm"
        self.token = 'SFT'
        self.language_name = "Українська"

    @staticmethod
    def new_transaction(user, token_name, amount, wallet):
        return f"""Транзакція на вивід:

ID: {user.id}
Name: {user.first_name}
Amount: {amount} {token_name}
Wallet: {wallet}"""

    @staticmethod
    def confirm():
        return "Підтвердити"

    @staticmethod
    def cancel():
        return "Відхилити"

    def home(self):
        return "🏠 Головне меню"

    def back(self):
        return "🔙 Назад"

    def my_farm(self):
        return "🌱 Моя ферма"

    def admin(self):
        return "🛠 Адмін"

    def home_menu(self):
        return "📋 Вітаю, в головному меню"

    def new_language_set(self):
        return f"✅ Нова мова встановлена: {self.language_name}"

    def change_language(self):
        return "🌐 Змінити мову"

    def new_partner(self, refer_username):
        return f"👫 У вас є новий друг {refer_username}, ви отримали {config.earn_for_task} {self.token} 🎉"

    def only_invite(self):
        return "🔒 Цей бот доступний лише за запрошенням"

    def all_codes_used(self):
        return "⚠️ Цей код вже використав максимум запрошень сьогодні, запросіть код завтра"

    def level_up(self, level):
        return f"""🎉 Вітаємо з підняттям до {level} рівня у грі Space Farm! 
🚀 Ви отримуєте нагороду – повний запас енергії! 
⚡️ Продовжуйте завойовувати космос та досягайте нових висот! 🌌"""

    def ru(self):
        return '🇷🇺 Ru'

    def ua(self):
        return '🇺🇦 UA'

    def en(self):
        return "🇬🇧 EN"

    def choose_language(self):
        return "🌐 Оберіть мову / Выберите язык / Please choose language"


class RuLanguage(UaLanguage):
    def __init__(self):
        self.language_name = "Русский"

    def home(self):
        return "🏠 Главное меню"

    def back(self):
        return "🔙 Назад"

    def my_farm(self):
        return "🌱 Моя ферма"

    def admin(self):
        return "🛠 Администратор"

    def new_partner(self, refer_username):
        return f"👫 У вас появился новый друг {refer_username}, вы получаете {config.earn_for_task} {self.token} 🎉"

    def home_menu(self):
        return "📋 Вы в главном меню"

    def new_language_set(self):
        return f"✅ Новый язык установлен: {self.language_name}"

    def launch_app(self):
        return "🚀 Запустить приложение"

    def change_language(self):
        return "🌐 Сменить язык"

    def only_invite(self):
        return "🔒 Бот доступен только по приглашению"

    def all_codes_used(self):
        return "⚠️ Данный код сегодня уже использован максимальное кол-во раз, запросите приглашение завтра"

    def level_up(self, level):
        return f"""🎉 Поздравляем с повышением до {level} уровня в игре Space Farm!
🚀 Вы получаете награду – полный запас энергии!
⚡️ Продолжайте покорять космос и достигать новых высот! 🌌"""


class EnLanguage(RuLanguage):
    def __init__(self):
        super().__init__()
        self.language_name = "English"

    def home(self):
        return "🏠 Home menu"

    def back(self):
        return "🔙 Back"

    def my_farm(self):
        return "🌱 My farm"

    def admin(self):
        return "🛠 Admin"

    def home_menu(self):
        return "📋 Hello at home menu"

    def new_language_set(self):
        return f"✅ New language set: {self.language_name}"

    def change_language(self):
        return "🌐 Change language"

    def new_partner(self, refer_username):
        return f"👫 You have a new friend {refer_username}, you are receiving {config.earn_for_task} {self.token} 🎉"

    def only_invite(self):
        return "🔒 The bot is available by invitation only"

    def all_codes_used(self):
        return "⚠️ This code has already been used the maximum number of times today, request an invitation tomorrow"

    def level_up(self, level):
        return f"""🎉 Congratulations on reaching Level {level} in Space Farm!
🚀 You've earned a reward – full energy!
⚡️ Keep conquering the cosmos and reaching new heights! 🌌"""


def get_language(language=3):
    if language == 1:
        language = RuLanguage()
    elif language == 2:
        language = EnLanguage()
    elif language == 3:
        language = UaLanguage()
    else:
        language = RuLanguage()
    return language
