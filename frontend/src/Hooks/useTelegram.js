const tg = window?.Telegram?.WebApp

export const useTelegram = () => {
  return {
    tg,
    user: tg.initDataUnsafe?.user
  }
}