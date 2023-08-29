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
        authorizationError: 'Вы не можете редактировать или удалять другого пользователя',
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
      statuses: {
        create: {
          error: 'Не удалось создать статус',
          success: 'Статус успешно создан',
        },
        delete: {
          error: 'Не удалось удалить статус',
          success: 'Статус успешно удалён',
        },
        update: {
          error: 'Не удалось изменить статус',
          success: 'Статус успешно изменён',
        },
      },
      tasks: {
        authorizationError: 'Задачу может удалить только её автор',
        create: {
          error: 'Не удалось создать задачу',
          success: 'Задача успешно создана',
        },
        delete: {
          error: 'Не удалось удалить задачу',
          success: 'Задача успешно удалена',
        },
        update: {
          error: 'Не удалось изменить задачу',
          success: 'Задача успешно изменена',
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
        tasks: 'Задачи',
      },
      form: {
        name: 'Наименование',
        email: 'Email',
        description: 'Описание',
        firstName: 'Имя',
        lastName: 'Фамилия',
        password: 'Пароль',
      },
    },
    views: {
      delete: 'Удалить',
      edit: 'Изменить',
      session: {
        new: {
          email: 'Email',
          password: 'Пароль',
          signIn: 'Вход',
          submit: 'Войти',
        },
      },
      statuses: {
        name: 'Статусы',
        createNew: 'Создать статус',
        id: 'ID',
        labelName: 'Наименование',
        createdAt: 'Дата создания',
        new: {
          header: 'Создание статуса',
          label: 'Наименование',
          create: 'Создать',
        },
        update: {
          header: 'Изменение статуса',
          change: 'Изменить',
        },
      },
      tasks: {
        name: 'Задачи',
        createNew: 'Создать задачу',
        id: 'ID',
        label: 'Наименование',
        status: 'Статус',
        author: 'Автор',
        executor: 'Исполнитель',
        createdAt: 'Дата создания',
        form: {
          header: 'Создание задачи',
          description: 'Описание',
        },
      },
      users: {
        name: 'Пользователи',
        id: 'ID',
        userName: 'Полное имя',
        email: 'Email',
        createdAt: 'Дата создания',
        actions: 'Действия',
        editLabel: 'Изменение пользователя',
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
