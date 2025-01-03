import json
import config
from texts import get_language
from aiogram import types
from aiogram.types import KeyboardButton, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo


class Keyboards:
    def __init__(self, language=3):
        self.language = get_language(language=language)
        self.inline = "inline"
        self.reply = "reply"

    @staticmethod
    def convert_to_send_type(buttons, keyboard_type) -> dict:
        keyboard = {"type": keyboard_type, "buttons": buttons}
        return keyboard

    def generate_reply_markup(self, buttons, home=None, back=None):
        buttons_list = []
        for row in buttons:
            if row:
                if len(row) != 1:
                    buttons_list.append([KeyboardButton(text=text) for text in row])
                else:
                    buttons_list.append([KeyboardButton(text=row[0])])
        if home:
            buttons_list.append(
                [
                    KeyboardButton(text=self.language.home())
                ]
            )
        if back:
            buttons_list.append(
                [
                    KeyboardButton(text=self.language.back())
                ]
            )
        markup = types.ReplyKeyboardMarkup(keyboard=buttons_list, resize_keyboard=True)
        return markup

    def generate_inline_markup(self, buttons, back=None):
        buttons_list = []
        for data in buttons:
            row = []
            for button in data:
                name = button.get('name')
                if 'callback' in button:
                    callback = button.get('callback')
                    row.append(InlineKeyboardButton(text=name, callback_data=callback))
                elif 'webapp' in button:
                    webapp = WebAppInfo(url=button.get('webapp'))
                    row.append(InlineKeyboardButton(text=name, web_app=webapp))
                elif 'url' in button:
                    url = button.get('url')
                    row.append(InlineKeyboardButton(text=name, url=url))
            if row:
                buttons_list.append(row)
        if back is True:
            buttons_list.append([InlineKeyboardButton(text=self.language.back(), callback_data="home")])
        elif back:
            buttons_list.append([InlineKeyboardButton(text=self.language.back(), callback_data=back)])
        markup = InlineKeyboardMarkup(row_width=2, inline_keyboard=buttons_list)
        return markup

    def farm(self, return_buttons=True):
        buttons = [
            [
                {
                    "name": self.language.my_farm(),
                    "webapp": config.base_url
                }
            ]
        ]
        if return_buttons:
            return buttons
        markup = self.generate_inline_markup(buttons=buttons)
        return markup

    def mail(self, user, return_buttons=True):
        buttons = [
            [
                {
                    "name": self.language.my_farm(),
                    "webapp": config.base_url + f"?lang={user.language}"
                }
            ],
            [
                {
                    "name": "Space Farm Channel",
                    "url": "https://t.me/SpaceCryptoFarm"
                }
            ]
        ]
        if return_buttons:
            return buttons
        markup = self.generate_inline_markup(buttons=buttons)
        return markup

    def home(self, user, return_buttons=True):
        buttons = [
            [
                {
                    "name": self.language.my_farm(),
                    "webapp": config.base_url + f"?lang={user.language}"
                }
            ],
            [
                {
                    "name": self.language.change_language(),
                    "callback": "lang"
                }
            ]
        ]
        if user.is_admin:
            buttons.append(
                [
                    {
                        "name": self.language.admin(),
                        "callback": 'admin'
                    }
                ]
            )
        if return_buttons:
            return buttons
        markup = self.generate_inline_markup(buttons=buttons)
        return markup

    def choose_language(self, return_buttons=True):
        buttons = [
            [
                {
                    "name": self.language.ru(),
                    "callback": "language_ru"
                },
                {
                    "name": self.language.en(),
                    "callback": "language_en"
                },
                {
                    "name": self.language.ua(),
                    "callback": "language_ua"
                }
            ]
        ]
        if return_buttons:
            return buttons
        markup = self.generate_inline_markup(buttons=buttons)
        return markup

    def transaction(self, transaction_id: int, return_buttons=True):
        buttons = [
            [
                {
                    "name": self.language.confirm(),
                    "callback": f"transaction_{transaction_id}_confirm"
                },
                {
                    "name": self.language.cancel(),
                    "callback": f"transaction_{transaction_id}_cancel"
                }
            ]
        ]
        if return_buttons:
            return buttons
        markup = self.generate_inline_markup(buttons=buttons)
        return markup
