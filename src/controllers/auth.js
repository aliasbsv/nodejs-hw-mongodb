import { registerUser, loginUser, logoutUser, refreshSession } from '../service/auth.js';

/* Настраивает параметры для создания сессионных cookies.
 * @param {object} res - объект ответа Express
 * @param {object} session - сессионные данные с токеном и сроком действия */
const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
};

/* Контроллер для регистрации нового пользователя. Создает пользователя и возвращает данные о нем. */
export async function registerController(req, res) {
  const payload = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  const registeredUser = await registerUser(payload);
  res.status(201).json({
    status: 201,
    message: 'User successfully registered!',
    data: registeredUser,
  });
}

/* Контроллер для входа пользователя в систему. Устанавливает сессионные cookies и возвращает accessToken. */
export async function loginController(req, res) {
  const { email, password } = req.body;
  const session = await loginUser(email, password);
  setupSession(res, session);
  res.status(200).json({
    status: 200,
    message: 'User successfully logged in!',
    data: {
      accessToken: session.accessToken,
    },
  });
}

/* Контроллер для выхода пользователя из системы. Очищает cookies и завершает сессию. */
export async function logoutController(req, res) {
  const { sessionId } = req.cookies;
  if (sessionId) {
    // Проверка на наличие sessionId
    await logoutUser(sessionId);
  }
  // Удаление сессионных cookies
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.status(204).end();
}

/* Контроллер для обновления accessToken. Обновляет cookies и возвращает новый accessToken.*/
export async function refreshController(req, res) {
  const { sessionId, refreshToken } = req.cookies;
  const session = await refreshSession(sessionId, refreshToken);
  setupSession(res, session);
  res.status(200).json({
    status: 200,
    message: 'Session successfully refreshed!',
    data: {
      accessToken: session.accessToken,
    },
  });
}
