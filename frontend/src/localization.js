class EnLanguage {
  constructor() {
    this.name = "Space Farm";
    this.token = "SFT";
    this.language_name = "English";
  }
  swap_exchange_error_valid() {
    return "Please enter a valid amount";
  }

  swap_exchange_error_bal() {
    return "Your balance is too low to make this exchange";
  }

  swap_exchange() {
    return "Exchange";
  }

  swap_exchange_placeholder() {
    return "Enter amount to exchange";
  }

  error_checking_subscription() {
    return "Try again";
  }

  not_subscribed_message() {
    return "Not Subscribed";
  }

  i_subscribed() {
    return "Done";
  }

  farm() {
    return "Farm";
  }

  buy() {
    return "Buy";
  }

  close() {
    return "Close";
  }

  total_cost() {
    return "Total Cost";
  }

  market() {
    return "Market";
  }

  plants(id) {
    if (id === 1) return "Potato";
    else if (id === 2) return "Onion";
    else if (id === 3) return "Cabbage";
    else return "Unknown";
  }

  buildPlantingTitle(lenght) {
    return `Plantation №${lenght + 1}`;
  }

  buildPlantingDesc() {
    return `You can build a new plantation and plant seeds in it.`;
  }

  buildPlantingDesc2() {
    return `After harvesting - you get ${this.token} right away`;
  }

  build() {
    return "Build";
  }

  select_seed() {
    return "Select seeds for planting";
  }

  planting_no_seed() {
    return "Grow";
  }

  planting() {
    return "Harvest";
  }

  harvest() {
    return "Harvest";
  }

  watering() {
    return "Watering";
  }

  seed() {
    return "Seed";
  }

  name_by_id(id) {
    if (id === 1) return "Electro Spud";
    else if (id === 2) return "Orbit Carrot";
    else if (id === 3) return "PopCorn Star";
    else if (id === 4) return "Eclipse Flower ";
    else if (id === 5) return "Liquid Cabbage";
    else if (id === 6) return "Moon Blueberry";
    else return "Electro Spud";
  }

  en_name_by_id(id) {
    if (id === 1) return "potato";
    else if (id === 2) return "carrot";
    else if (id === 3) return "popcorn";
    else if (id === 4) return "flower";
    else if (id === 5) return "cabbage";
    else if (id === 6) return "blueberry";
    else return "potato";
  }

  earn() {
    return "Earn";
  }

  cost() {
    return "Cost";
  }

  energy() {
    return "Energy";
  }

  get_energy() {
    return "Get Energy";
  }

  get_spins() {
    return "Invite friend";
  }

  spins_not_enough() {
    return "You have no spins. Invite a friend to get 1 spin";
  }

  energy_not_enough() {
    return "You dont have enough energy";
  }

  coming_soon() {
    return "Coming soon";
  }

  next_energy() {
    return "Next energy:";
  }

  subscribe_community() {
    return "Join channel";
  }

  invite_frends() {
    return "Invite friends";
  }

  invite_msg() {
    return "Become my friend and earn with me";
  }

  balance() {
    return "Your balance";
  }

  balance_enough() {
    return "You don't have enough coins";
  }

  exchange() {
    return "Exchange";
  }

  hello_step1() {
    return "Discover many planets and build your farm on them to earn coins!";
  }

  hello_step2() {
    return "Open new beds, plant crops and collect rewards when the fruit is ready !";
  }

  hello_step3() {
    return "Use the shop to unlock and buy new crops. You can upgrade a plant to increase its profit !";
  }

  hello_step4() {
    return "Grow crops, speed up growth, and unlock plantations. Energy replenishes, and its limit can be increased by inviting a friend!";
  }

  hello_step5() {
    return "Invite friends and complete other  quests to earn more coins and bonuses!";
  }

  hello_title_step1() {
    return "Galaxy Travel";
  }

  hello_title_step2() {
    return "Space Farm";
  }

  hello_title_step3() {
    return "Plant Shop";
  }

  hello_title_step4() {
    return "Use Energy Wisely";
  }

  hello_title_step5() {
    return "Quests";
  }

  continue() {
    return "Continue";
  }

  tap_comet_prompt() {
    return "Look! It's a meteorite! Tap it quickly to get a prize!";
  }

  tap_comet_reward() {
    return "You earned coins! Meteorites periodically fall on this screen, catch them to speed up your progress!";
  }

  finish() {
    return "Finish";
  }

  invite_lefts(count) {
    return ` ${count} / 10`;
  }

  start() {
    return "Start";
  }

  claim() {
    return "Claim";
  }

  done() {
    return "Done";
  }

  back() {
    return "Back";
  }

  closed_planets() {
    return "You need more invite crystals to open this planet";
  }

  energy_is_full() {
    return "Your energy is fully restored";
  }

  will_available() {
    return "Will be available at 100 level";
  }

  no_users_league() {
    return "No players in this league";
  }

  subscribe_preview() {
    return "Please subscribe to our channel to continue using the app.";
  }

  withdraw_wallet() {
    return "wallet address";
  }

  withdraw_amount() {
    return "How many coins to withdraw?";
  }

  withdraw_amount_ton() {
    return "How many TON to deposit/withdraw?";
  }

  withdraw_button() {
    return "Submit";
  }

  withdraw_alert_1() {
    return "Amount over $5 is available for withdrawal!";
  }

  withdraw_alert_2() {
    return "Withdrawal is available from level 100!";
  }

  withdraw_alert_3() {
    return "Not enough tokens to withdraw";
  }

  withdraw() {
    return "Withdraw";
  }

  help() {
    return "Help Marsik become famous and earn up to";
  }
  addLink() {
    return "ADD LINK";
  }
  instructions1() {
    return "Make a fan video about a space farm.";
  }
  instructions2() {
    return "Upload content to any platform with the hashtag #spacefarmmarsik and a referral code under the video.";
  }
  instructions3() {
    return "Send a link to your post when it gets 100+ views. The more views at the time of sending, the more coins we will count.";
  }
  viewsReward() {
    return "Views Reward";
  }
  views() {
    return "Views";
  }
  reward() {
    return "Reward";
  }
  copied() {
    return "COPIED";
  }
}

class RuLanguage extends EnLanguage {
  constructor() {
    super();
    this.name = "Space Farm";
    this.token = "SFT";
    this.language_name = "Русский";
  }

  swap_exchange_error_valid() {
    return "Пожалуйста, введите действительную сумму";
  }

  swap_exchange_error_bal() {
    return "Ваш баланс слишком мал для совершения этого обмена";
  }

  swap_exchange_placeholder() {
    return "Введите сумму для обмена";
  }

  swap_exchange() {
    return "Обменять";
  }

  error_checking_subscription() {
    return "Попробуйте еще раз";
  }

  not_subscribed_message() {
    return "Вы не подписаны";
  }

  i_subscribed() {
    return "Готово";
  }

  farm() {
    return "Ферма";
  }

  buy() {
    return "Купить";
  }

  close() {
    return "Закрыть";
  }

  total_cost() {
    return "Общяя сумма";
  }

  market() {
    return "Магазин";
  }

  plants(id) {
    if (id === 1) return "Картошка";
    else if (id === 2) return "Лук";
    else if (id === 3) return "Капуста";
    else return "Неизвестно";
  }

  buildPlantingTitle(lenght) {
    return `Плантация №${lenght + 1}`;
  }

  buildPlantingDesc() {
    return `Вы можете построить новую плантацию и посадить в ней семена.`;
  }

  buildPlantingDesc2() {
    return `После сбора урожая – вы получаете сразу ${this.token}`;
  }

  build() {
    return "Построить";
  }

  select_seed() {
    return "Выбор семян для посадки";
  }

  planting_no_seed() {
    return "Вырастить";
  }

  planting() {
    return "Посадка";
  }

  harvest() {
    return "Собрать";
  }

  watering() {
    return "Полить";
  }

  seed() {
    return "Семена";
  }

  name_by_id(id) {
    if (id === 1) return "Електро Картофель";
    else if (id === 2) return "Орбитальная Морковь";
    else if (id === 3) return "Звездная кукуруза";
    else if (id === 4) return "Цветок затмения";
    else if (id === 5) return "Жидкая капуста";
    else if (id === 6) return "Лунная голубика";
    else return "Електро Картофель";
  }

  earn() {
    return "Доход";
  }

  cost() {
    return "Стоимость";
  }

  energy() {
    return "Энергия";
  }

  get_energy() {
    return "Получить энергию";
  }

  get_spins() {
    return "Пригласить друга";
  }

  spins_not_enough() {
    return "У тебя нет спинов. Пригласи друга чтобы получить 1 спин";
  }

  energy_not_enough() {
    return "У тебя не достаточно энергии";
  }

  coming_soon() {
    return "Скоро станет доступно";
  }

  next_energy() {
    return "Следующая энергия:";
  }

  subscribe_community() {
    return "Подписаться";
  }

  subscribe_preview() {
    return "Пожалуйста, подпишитесь на наш канал, чтобы продолжить использование приложения.";
  }

  invite_frends() {
    return "Пригласить";
  }

  invite_msg() {
    return "Стань моим другом и зарабатывай со мной";
  }

  balance() {
    return "Ваш баланс";
  }

  balance_enough() {
    return "У тебя не достаточно монет";
  }

  exchange() {
    return "Обменник";
  }

  hello_step1() {
    return "Откройте для себя множество планет и постройте на них свою ферму, чтобы заработать монеты!";
  }

  hello_step2() {
    return "Открывайте новые грядки, сажайте культуры и собирайте награды, когда плоды будут готовы!";
  }

  hello_step3() {
    return "Используйте магазин, чтобы разблокировать и купить новые культуры. Вы можете модернизировать растение, чтобы увеличить его прибыль!";
  }

  hello_step4() {
    return "Выращивайте культуры, ускоряйте рост и открывайте плантации. Энергия восполняется, а ее лимит можно увеличить, пригласив друга!";
  }

  hello_step5() {
    return "Приглашайте друзей и выполняйте другие задания, чтобы заработать больше монет и бонусов!";
  }

  hello_title_step1() {
    return "Галактическое путешествие";
  }

  hello_title_step2() {
    return "Космическая ферма";
  }

  hello_title_step3() {
    return "Магазин растений";
  }

  hello_title_step4() {
    return "Используйте энергию с умом";
  }

  hello_title_step5() {
    return "Квесты";
  }

  continue() {
    return "Продолжить";
  }

  tap_comet_prompt() {
    return "Смотри! Это метеорит! Нажми на него, чтобы получить приз!";
  }

  tap_comet_reward() {
    return "Вы заработали монеты! На этом экране периодически падают метеориты, ловите их, чтобы ускорить свой прогресс!";
  }

  finish() {
    return "Закончить";
  }

  invite_lefts(count) {
    return ` (${count}) осталось`;
  }

  back() {
    return "Назад";
  }

  closed_planets() {
    return "Вам нужно больше пригласительных кристаллов, чтобы открыть эту планету";
  }

  energy_is_full() {
    return "Ваша энергия полностью восстановлена";
  }

  will_available() {
    return "Будет доступно на уровне 100 ";
  }

  no_users_league() {
    return "В этой лиге нет игроков";
  }

  withdraw_wallet() {
    return "адрес кошелька";
  }

  withdraw_amount() {
    return "Сколько монет выводить?";
  }

  withdraw_button() {
    return "Отправить";
  }

  withdraw_alert_1() {
    return "Для вывода доступна сумма от $5!";
  }

  withdraw_alert_2() {
    return "Вывод доступен от 100lvl!";
  }

  withdraw_alert_3() {
    return "Недостаточно токенов для вывода";
  }

  withdraw() {
    return "Вывод";
  }

  help() {
    return "Помогите Марсику стать знаменитым и заработайте до";
  }
  addLink() {
    return "ССЫЛКА";
  }
  instructions1() {
    return "Сделайте фанатское видео о космической ферме.";
  }
  instructions2() {
    return "Загрузите контент на любую платформу с хэштегом #spacefarmmarsik и реферальным кодом под видео.";
  }
  instructions3() {
    return "Отправьте ссылку на ваш пост, когда он наберёт 100+ просмотров. Чем больше просмотров на момент отправки, тем больше монет мы засчитаем.";
  }
  viewsReward() {
    return "Награда за просмотры";
  }
  views() {
    return "Просмотры";
  }
  reward() {
    return "Награда";
  }
  copied() {
    return "СКОПИРОВАНО";
  }
}

class UaLanguage extends RuLanguage {
  constructor() {
    super();
    this.language_name = "Українська";
  }

  swap_exchange_error_valid() {
    return "Будь ласка введіть правильну суму";
  }

  swap_exchange_error_bal() {
    return "Ваш баланс занадто малий, щоб здійснити цей обмін";
  }

  swap_exchange_placeholder() {
    return "Введіть суму для обміну";
  }

  swap_exchange() {
    return "Обміняти";
  }

  farm() {
    return "Ферма";
  }

  buy() {
    return "Купити";
  }

  close() {
    return "Закрити";
  }

  total_cost() {
    return "Загальна сума";
  }

  market() {
    return "Магазин";
  }

  plants(id) {
    if (id === 1) return "Картопля";
    else if (id === 2) return "Цибуля";
    else if (id === 3) return "Капуста";
    else return "Невідомо";
  }

  buildPlantingTitle(length) {
    return `Плантація №${length + 1}`;
  }

  buildPlantingDesc() {
    return "Ви можете побудувати нову плантацію та посадити в ній насіння.";
  }

  buildPlantingDesc2() {
    return `Після збору врожаю – ви отримуєте відразу ${this.token}`;
  }

  build() {
    return "Побудувати";
  }

  select_seed() {
    return "Вибір насіння для посадки";
  }

  planting_no_seed() {
    return "Виростити";
  }

  planting() {
    return "Посадка";
  }

  harvest() {
    return "Зібрати";
  }

  watering() {
    return "Полити";
  }

  seed() {
    return "Насіння";
  }

  name_by_id(id) {
    if (id === 1) return "Електро Картопля";
    else if (id === 2) return "Орбітальна Морква";
    else if (id === 3) return "Зіркова кукурудза";
    else if (id === 4) return "Квітка затемнення";
    else if (id === 5) return "Рідка капуста";
    else if (id === 6) return "Місячна Чорниця";
    else return "Електро Картопля";
  }

  earn() {
    return "Дохід";
  }

  cost() {
    return "Вартість";
  }

  energy() {
    return "Енергія";
  }

  get_energy() {
    return "Отримати енергію";
  }

  get_spins() {
    return "Запросити друга";
  }

  spins_not_enough() {
    return "У тебе немає спінів. Запроси друга щоб отримати 1 спін";
  }

  energy_not_enough() {
    return "У вас недостатньо енергії";
  }

  coming_soon() {
    return "Незабаром буде доступно";
  }

  next_energy() {
    return "Наступна енергія:";
  }

  subscribe_community() {
    return "Підписатися";
  }

  invite_frends() {
    return "Запросити";
  }

  invite_msg() {
    return "Стань моїм другом і заробляй зі мною";
  }

  balance() {
    return "Ваш баланс";
  }

  balance_enough() {
    return "У вас недостатньо монет";
  }

  exchange() {
    return "Обмінник";
  }

  hello_step1() {
    return "Відкрийте для себе безліч планет і побудуйте на них свою ферму, щоб заробити монети!";
  }

  hello_step2() {
    return "Відкривайте нові грядки, саджайте культури і збирайте нагороди, коли плоди будуть готові!";
  }

  hello_step3() {
    return "Використовуйте магазин, щоб розблокувати та купити нові культури. Ви можете модернізувати рослину, щоб збільшити її прибуток!";
  }

  hello_step4() {
    return "Вирощуйте культури, прискорюйте ріст і відкривайте плантації. Енергія відновлюється, а її ліміт можна збільшити, запросивши друга!";
  }

  hello_step5() {
    return "Запрошуйте друзів і виконуйте інші завдання, щоб заробити більше монет та бонусів!";
  }

  hello_title_step1() {
    return "Галактична подорож";
  }

  hello_title_step2() {
    return "Космічна ферма";
  }

  hello_title_step3() {
    return "Магазин рослин";
  }

  hello_title_step4() {
    return "Використовуйте енергію з розумом";
  }

  hello_title_step5() {
    return "Квести";
  }

  continue() {
    return "Продовжити";
  }

  tap_comet_prompt() {
    return "Дивись! Це метеорит! Натисни на нього, щоб отримати приз!";
  }

  tap_comet_reward() {
    return "Ви заробили монети! Метеорити періодично падають на цьому екрані, ловіть їх, щоб прискорити свій прогрес!";
  }

  finish() {
    return "Закінчити";
  }

  invite_lefts(count) {
    return ` (${count}) залишилося`;
  }

  back() {
    return "Назад";
  }

  closed_planets() {
    return "Вам потрібно більше запрошувальних кристалів, щоб відкрити цю планету";
  }

  energy_is_full() {
    return "Ваша енергія повністю відновлена";
  }

  will_available() {
    return "Буде доступно на рівні 100";
  }

  no_users_league() {
    return "У цій лізі немає гравців";
  }

  subscribe_preview() {
    return "Будь ласка, підпишіться на наш канал, щоб продовжити використання програми.";
  }

  error_checking_subscription() {
    return "Спробуйте ще раз";
  }

  not_subscribed_message() {
    return "Ви не підписані";
  }

  i_subscribed() {
    return "Готово";
  }

  withdraw_wallet() {
    return "адреса гаманця";
  }

  withdraw_amount() {
    return "Скільки монет вивести?";
  }

  withdraw_button() {
    return "Надіслати";
  }

  withdraw_alert_1() {
    return "Для виведення доступна сума від $5!";
  }

  withdraw_alert_2() {
    return "Виведення доступне з 100 рівня!";
  }

  withdraw_alert_3() {
    return "Недостатньо токенів для виведення";
  }

  withdraw() {
    return "Вивід";
  }

  help() {
    return "Допоможіть Марсику стати відомим і заробити до";
  }
  addLink() {
    return "ПОСИЛАННЯ";
  }

  copied() {
    return "СКОПІЙОВАНО";
  }

  instructions1() {
    return "Зробіть фанатське відео про космічну ферму.";
  }
  instructions2() {
    return "Завантажте контент на будь-яку платформу з хештегом #spacefarmmarsik і реферальним кодом під відео.";
  }
  instructions3() {
    return "Надішліть посилання на ваш пост, коли він набере 100+ переглядів. Чим більше переглядів на момент відправки, тим більше монет ми нарахуємо.";
  }
  viewsReward() {
    return "Нагорода за перегляди";
  }
  views() {
    return "Перегляди";
  }
  reward() {
    return "Нагорода";
  }
}

export function get_language(language = 1) {
  if (language === 1) {
    return new RuLanguage();
  } else if (language === 2) {
    return new EnLanguage();
  } else if (language === 3) {
    return new UaLanguage();
  } else {
    return new RuLanguage();
  }
}
