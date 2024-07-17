export const environment = {

  pageDescription: 'Книги на русском в Португалии; Книги в наличии и под заказ; VARËNKA - это европейский книжный проект, в котором собраны волшебные истории, созданные потрясающими авторами и талантливыми иллюстраторами современности, мировая классика в самых лучших изданиях, книги об искусстве, познавательная и иностранная литература для детей и взрослых.',
  pageTitle: 'VARENKA - книги на русском в Португалии; книжный магазин в Порту, Португалия; книги в наличии и под заказ',

  deliveryTypeNames:{
    "pickup_from_warehouse": 'Самовывоз в Порту',
    "pick_point": 'Самовывоз из пункта выдачи',
    "courier_delivery": 'Доставка курьером на дом',
    "mail_delivery": 'Доставка почтой по Португалии',
    "mail_delivery_europe": 'Доставка почтой по Европе',
  },

  errors: {
    fieldError: 'Некорректное значение поля',
    concentDataProcessingError:'Поле не может быть пустым',
    deliveryTypeError:'Поле не может быть пустым',
    nameError:'Поле не может быть пустым',
    emailNullableError:'Поле не может быть пустым',
    latinNameError:'Поле не может быть пустым',
    emailCorrectError: 'Некорректный email',
    phoneNullableError:'Поле не может быть пустым',
    phoneCorrectError: 'Некорректный телефон',
    mask: 'Некорректный телефон',
    postalCodeError:'Поле не может быть пустым',
    countryError:'Поле не может быть пустым',
    cityError:'Поле не может быть пустым',
    pickPointError:'Поле не может быть пустым',
    customerExist: "Вы уже подписаны на рассылку",
    responseError: "Произошла ошибка, попробуйте повторить опзднее",
    max: 'Некорректное значение поля',

  },

    coverTypes: {
      board_book: "Книжка-картонка",
      hard_cover: "Твердая обложка",
      soft_cover: "Мягкая обложка",

    },

  stripe: {
    publicKey: 'pk_live_51NmKtuFjFAvOK5oXKvAKk5tiIF01hN3c7vyFtOx5wwmWQPovhKUksyA83rd8HsU02lXFy6LNpJRoTcLasRcOlI1D00CwlaTklB',
  },

  dns: "http://varenkabooks.com/",

  shopAddress:
    {
      address: "Rua do Almada 448, Porto, 4050-034, Portugal",
      link: "https://maps.app.goo.gl/A3UH8zztL7Xuj2y56"
    },
  instagram: 'https://www.instagram.com/varenka_books?igsh=MTQ0aG90Y3Q3amNoZA==',
  telegram: 'https://t.me/varenka_books',

  email: 'varenka.books@gmail.com',
  legalInfo: 'Empresário em Nome Individual, Daria Dombrova, Número fiscal 313 283 834',
  certificateImage: '../../../assets/certificates/certificate_vertical.png'

};
