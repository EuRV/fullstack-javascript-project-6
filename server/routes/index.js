import welcome from './welcome.js';
import users from './users/routes.js';
import session from './sessions/routes.js';
import statuses from './statuses.js';
import tasks from './tasks.js';
import labels from './labels.js';

const controllers = [
  welcome,
  users,
  session,
  statuses,
  tasks,
  labels,
];

export default (app) => controllers.forEach((f) => f(app));
