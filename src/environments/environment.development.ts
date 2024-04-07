export const environment = {
  deliveryTypeNames: {
    "pickup_from_warehouse": 'Самовывоз в Порту',
    "pick_point": 'Самовывоз из пункта выдачи',
    "courier_delivery": 'Доставка курьером на дом',
    "mail_delivery": 'Доставка почтой',
  },

  errors: {

    fieldError: 'Некорректное значение поля',
    concentDataProcessingError: 'Поле не может быть пустым',
    deliveryTypeError: 'Поле не может быть пустым',
    nameError: 'Поле не может быть пустым',
    emailNullableError: 'Поле не может быть пустым',
    latinNameError: 'Поле не может быть пустым',
    emailCorrectError: 'Некорректный email',
    phoneNullableError: 'Поле не может быть пустым',
    phoneCorrectError: 'Некорректный телефон',
    phoneNumber: 'Некорректный телефон',
    mask: 'Некорректный телефон',
    postalCodeError: 'Поле не может быть пустым',
    countryError: 'Поле не может быть пустым',
    cityError: 'Поле не может быть пустым',
    pickPointError: 'Поле не может быть пустым',
    customerExist: "Вы уже подписаны на рассылку",
    responseError: "Произошла ошибка, попробуйте повторить опзднее",
    max: 'Некорректное значение поля',
  },

  stripe: {
    publicKey: 'pk_test_51OnkB4EHIQl1lJBCCIrkt0IroCaDle9BrxPZRHmmsOPbaQJhLq48gdNjq5mRHpRDI6yGBnUOPD9en9uJD4cREibt00EHqHAj5u',
  },

  dns: "http://192.168.1.134:4200/",

  shopAddress:
    {
      address: "Rua do Almada 448, Porto, 4050-034, Portugal",
      link: "https://maps.app.goo.gl/A3UH8zztL7Xuj2y56"
    },

  email: 'varenka.books@gmail.com',

  instagram: 'https://www.instagram.com/varenka_books?igsh=MTQ0aG90Y3Q3amNoZA==',
  telegram: 'https://t.me/varenka_books_bot',

  legalInfo: 'Empresário em Nome Individual, Daria Dombrova, Número fiscal 313 283 834',

  certificateImage: '../../../assets/certificates/certificate_vertical.png'

};
