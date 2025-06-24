export default {
  translation: {
    appName: 'Менеджер задач',
    buttons: {
      change: 'Изменить',
      delete: 'Удалить',
      login: 'Войти',
      save: 'Сохранить',
    },
    flash: {
      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
      notCurrentUser: 'Вы не можете редактировать или удалять другого пользователя',
      session: {
        create: {
          success: 'Вы залогинены',
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
    },
    layouts: {
      application: {
        labels: 'Метки',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
        statuses: 'Статусы',
        tasks: 'Задачи',
        users: 'Пользователи',
      },
    },
    session: {
      new: {
        signIn: 'Вход',
      },
    },
    welcome: {
      index: {
        hello: 'Привет от Хекслета!',
        description: 'Практические курсы по программированию',
        more: 'Узнать Больше',
      },
    },
    users: {
      index: {
        title: 'Пользователи',
        id: 'ID',
        fullName: 'Полное имя',
        email: 'Email',
        createdAt: 'Дата создания',
        actions: 'Действия',
      },
      new: {
        title: 'Регистрация',
      },
      edit: {
        title: 'Изменение пользователя',
      },
    },
    statuses: {
      index: {
        title: 'Статусы',
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
        actions: 'Действия',
        buttons: {
          create: 'Создать статус',
        },
      },
    },
    form: {
      firstName: 'Имя',
      lastName: 'Фамилия',
      email: 'Email',
      password: 'Пароль',
    },
  },
};
