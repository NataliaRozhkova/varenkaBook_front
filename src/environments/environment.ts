export const environment = {
  deliveryTypeNames:{
    "pickup_from_warehouse": 'Самовывоз в Порту',
    "pick_point": 'Самовывоз из пункта выдачи',
    "courier_delivery": 'Доставка курьером на дом',
    "mail_delivery": 'Доставка почтой',
  },

  errors: {
    fieldError: 'Некорректное значение поля',
    concentDataProcessingError:'Поле не может быть пустым',
    deliveryTypeError:'Поле не может быть пустым',
    nameError:'Поле не может быть пустым',
    emailNullableError:'Поле не может быть пустым',
    emailCorrectError: 'Некорректное значение email',
    phoneNullableError:'Поле не может быть пустым',
    phoneCorrectError: 'Некорректный телефон',
    postalCodeError:'Поле не может быть пустым',
    countryError:'Поле не может быть пустым',
    cityError:'Поле не может быть пустым',
    pickPointError:'Поле не может быть пустым',
    customerExist: "Вы уже подписаны на рассылку"
  },

  stripe: {
    publicKey: 'pk_test_51OnkB4EHIQl1lJBCCIrkt0IroCaDle9BrxPZRHmmsOPbaQJhLq48gdNjq5mRHpRDI6yGBnUOPD9en9uJD4cREibt00EHqHAj5u',
  },

  dns: "http://varenkabooks.com/"
};
