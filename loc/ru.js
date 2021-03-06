module.exports = {
  _: {
    storage_is_encrypted: 'Ваше хранилище зашифровано. Введите пароль для расшифровки',
    enter_password: 'Введите пароль',
    bad_password: 'Неверный пароль, попробуйте еще раз',
    months_ago: 'месяцев назад',
    days_ago: 'дней назад',
    hours_ago: 'часов назад',
    never: 'никогда',
  },
  wallets: {
    list: {
      tabBarLabel: 'Кошельки',
      app_name: 'BlueWallet',
      title: 'Мои Кошельки',
      header: 'Кошелек это секретный (приватный) ключ, и соответствующий ему адрес на который можно получать биткоины',
      add: 'Добавить Кошелек',
      create_a_wallet: 'Создать кошелек',
      create_a_wallet1: 'Это бесплатно и вы можете создать',
      create_a_wallet2: 'неограниченное количество',
      latest_transaction: 'последняя транзакция',
      empty_txs1: 'Список транзакций пока пуст',
      empty_txs2: ' ',
    },
    add: {
      title: 'Добавить Кошелек',
      description:
        'Вы можете отсканировать QR код (в формате WIF - Wallet Import Format), или создать новый кошелек. Segwit поддерживается по умолчанию.',
      scan: 'Отсканировать',
      create: 'Создать',
      label_new_segwit: 'Новый SegWit',
    },
    details: {
      title: 'Информация о Кошельке',
      address: 'Адрес',
      type: 'Тип',
      label: 'Метка',
      are_you_sure: 'Вы уверены?',
      yes_delete: 'Да, удалить',
      no_cancel: 'Нет, отмена',
      delete_this_wallet: 'Удалить этот кошелек',
      export_backup: 'Экспорт / резервная копия',
    },
    export: {
      title: 'Экспорт Кошелька',
    },
    scanQrWif: {
      go_back: 'Назад',
      cancel: 'Отмена',
      decoding: 'Декодирую',
      input_password: 'Введите пароль',
      password_explain: 'Приватный ключ зашифрован по стандарту BIP38',
      bad_password: 'Неверный пароль',
      wallet_already_exists: 'Такой кошелек уже существует',
      bad_wif: 'Некорректный WIF',
      imported_wif: 'Импортирован WIF ',
      with_address: ' с адресом ',
      imported_segwit: 'Импортированый SegWit',
      imported_legacy: 'Импортированый Legacy',
    },
  },
  transactions: {
    list: {
      tabBarLabel: 'Транзакции',
      title: 'Мои транзакции',
      description: 'Список входящих или исходящих транзакций ваших кошельков',
      conf: 'подтв.',
    },
    details: {
      title: 'Детали транзакци',
      from: 'От',
      to: 'Кому',
    },
  },
  send: {
    list: {
      tabBarLabel: 'Отправить',
      header: 'Отправить',
    },
    details: {
      title: 'Создать Транзакцию',
      amount_fiels_is_not_valid: 'Поле не валидно',
      fee_fiels_is_not_valid: 'Поле `комиссия` не валидно',
      address_fiels_is_not_valid: 'Поле `адрес` не валидно',
      receiver_placeholder: 'Адрес получателя',
      amount_placeholder: 'сколько отправить (в BTC)',
      fee_placeholder: 'плюс комиссия за перевод (в BTC)',
      memo_placeholder: 'примечание платежа',
      cancel: 'Отмена',
      scan: 'Скан QR',
      create: 'Создать',
      remaining_balance: 'Остаток баланса',
    },
    create: {
      title: 'Создать Транзакцию',
      error: 'Ошибка при создании транзакции. Неправильный адрес назначения или недостаточно средств?',
      go_back: 'Назад',
      this_is_hex: 'Это данные транзакции. Транзакция подписана и готова быть транслирована в сеть. Продолжить?',
      to: 'Куда',
      amount: 'Сколько',
      fee: 'Комиссия',
      tx_size: 'Размер',
      satoshi_per_byte: 'Сатоши на байт',
      memo: 'Примечание',
      broadcast: 'Отправить',
    },
  },
  receive: {
    list: {
      tabBarLabel: 'Получить',
      header: 'Получить',
    },
    details: {
      title: 'Покажите этот адрес плательщику',
    },
  },
  settings: {
    tabBarLabel: 'Настройки',
    header: 'Настройки',
    plausible_deniability: 'Правдоподобное отрицание...',
    storage_not_encrypted: 'Хранилище: не зашифровано',
    storage_encrypted: 'Хранилище: зашифровано',
    password: 'Пароль',
    password_explain: 'Придумайте пароль для расшифровки хранилища',
    retype_password: 'Наберите пароль повторно',
    passwords_do_not_match: 'Пароли не совпадают',
    encrypt_storage: 'Зашифровать хранилище',
    about: 'О программе',
  },
  plausibledeniability: {
    title: 'Правдоподобное Отрицание',
    help:
      'При определенных обстоятельствах вас могут вынудить раскрыть пароль. ' +
      'Чтобы сохранить ваши биткоины в безопасности, BlueWallet может создать ' +
      'еще одно зашифрованое хранилище, с другим паролем. Под давлением, ' +
      'вы можете раскрыть третьим лицам этот пароль. Если ввести этот пароль в ' +
      "BlueWallet, разблокируется 'фальшивое' хранилище. Это будет выглядеть " +
      'правдоподобно для третьих лиц, но при этом сохранит ваше основное хранилище ' +
      'с биткоинами в безопасности.',
    help2:
      'Новое хранилище будет полностью функциональным и вы даже можете хранить на нем немного биткоинов ' +
      'чтобы это выглядело более правдоподобно.',
    create_fake_storage: 'Создать фальшивое хранилище',
    go_back: 'Назад',
    create_password: 'Придумайте пароль',
    create_password_explanation: 'Пароль для фальшивого хранилища не должен быть таким же как основной пароль',
    password_should_not_match: 'Пароль для фальшивого хранилища не должен быть таким же как основной пароль',
    retype_password: 'Наберите пароль повторно',
    passwords_do_not_match: 'Пароли не совпадают, попробуйте еще раз',
    success: 'Операция успешна',
  },
};
