export default {
  translation: {
    appName: 'Менеджер задач',
    flash: {
      session: {
        create: {
          success: 'Вы залогинены',
          error: 'Неправильный емейл или пароль',
        },
        delete: {
          success: 'Вы разлогинены',
        },
      },
      users: {
        create: {
          error: 'Не удалось зарегистрировать',
          success: 'Пользователь успешно зарегистрирован',
        },
        update: {
          error: 'Не удалось изменить пользователя',
          success: 'Пользователь успешно изменён',
        },
        delete: {
          error: 'Не удалось удалить пользователя',
          success: 'Пользователь успешно удалён',
        },
      },
      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
    },
    layouts: {
      application: {
        users: 'Пользователи',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
        statuses: 'Статусы',
      },
    },
    views: {
      session: {
        new: {
          signIn: 'Вход',
          submit: 'Войти',
        },
      },
      statuses: {
        name: 'Статусы',
        createButton: 'Создать статус',
        id: 'ID',
        labelName: 'Наименование',
        createdAt: 'Дата создания',
        edit: 'Изменить',
        delete: 'Удалить',
      },
      users: {
        name: 'Пользователи',
        id: 'ID',
        userName: 'Полное имя',
        email: 'Email',
        createdAt: 'Дата создания',
        actions: 'Действия',
        edit: 'Изменить',
        editLabel: 'Изменение пользователя',
        delete: 'Удалить',
        new: {
          submit: 'Сохранить',
          signUp: 'Регистрация',
          email: 'email',
          password: 'пароль',
          firstName: 'Имя',
          lastName: 'Фамилия',
        },
      },
      welcome: {
        index: {
          hello: 'Привет от Хекслета!',
          description: 'Практические курсы по программированию',
          more: 'Узнать Больше',
        },
      },
    },
  },
};
