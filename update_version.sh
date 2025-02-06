#!/bin/bash

# Проверка на наличие аргументов
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Ошибка: Не указаны версия и переменная для обновления!"
  echo "Использование: ./update_versions.sh <переменная> <новая версия>"
  echo "Пример: ./update_versions.sh FRONT_VERSION 202502061520"
  exit 1
fi

# Переменные
VAR_NAME=$1
NEW_VERSION=$2

# Умолчательные значения
DEFAULT_FRONT_VERSION="latest"
DEFAULT_BACK_VERSION="latest"

# Проверка, существует ли файл .env
if [ ! -f .env ]; then
  echo "Файл .env не найден. Создаю новый файл..."

  # Если переменная FRONT_VERSION
  if [ "$VAR_NAME" == "FRONT_VERSION" ]; then
    echo "FRONT_VERSION=${NEW_VERSION}" > .env
    echo "BACK_VERSION=${DEFAULT_BACK_VERSION}" >> .env
    echo "Файл .env создан, переменная FRONT_VERSION установлена в ${NEW_VERSION}, BACK_VERSION установлена в ${DEFAULT_BACK_VERSION}"
  # Если переменная BACK_VERSION
  elif [ "$VAR_NAME" == "BACK_VERSION" ]; then
    echo "FRONT_VERSION=${DEFAULT_FRONT_VERSION}" > .env
    echo "BACK_VERSION=${NEW_VERSION}" >> .env
    echo "Файл .env создан, переменная FRONT_VERSION установлена в ${DEFAULT_FRONT_VERSION}, BACK_VERSION установлена в ${NEW_VERSION}"
  else
    echo "Ошибка: Неизвестная переменная ${VAR_NAME}"
    exit 1
  fi
else
  # Обновляем переменную в .env
  if [ "$VAR_NAME" == "FRONT_VERSION" ]; then
    if grep -q "FRONT_VERSION=" .env; then
      sed -i "s/^FRONT_VERSION=.*/FRONT_VERSION=${NEW_VERSION}/" .env
      echo "Переменная FRONT_VERSION обновлена на ${NEW_VERSION}"
    else
      echo "FRONT_VERSION=${NEW_VERSION}" >> .env
      echo "Переменная FRONT_VERSION добавлена в файл .env"
    fi
  elif [ "$VAR_NAME" == "BACK_VERSION" ]; then
    if grep -q "BACK_VERSION=" .env; then
      sed -i "s/^BACK_VERSION=.*/BACK_VERSION=${NEW_VERSION}/" .env
      echo "Переменная BACK_VERSION обновлена на ${NEW_VERSION}"
    else
      echo "BACK_VERSION=${NEW_VERSION}" >> .env
      echo "Переменная BACK_VERSION добавлена в файл .env"
    fi
  else
    echo "Ошибка: Неизвестная переменная ${VAR_NAME}"
    exit 1
  fi
fi

