import createHttpError from 'http-errors';
import { User } from '../db/models/user.js'; // Модель пользователя для получения данных о пользователе
import { Session } from '../db/models/session.js'; // Модель сессии для проверки токена доступа

// Middleware для аутентификации пользователя по токену доступа
export async function authenticate(req, res, next) {
  const { authorization } = req.headers;

  // Проверяем, предоставлен ли заголовок Authorization
  if (typeof authorization !== 'string') {
    return next(createHttpError(401, 'Please provide Authorization header'));
  }

  // Разделяем заголовок на тип токена и сам токен
  const [bearer, accessToken] = authorization.split(' ', 2);

  // Проверяем, что заголовок имеет формат "Bearer <token>"
  if (bearer !== 'Bearer' || typeof accessToken !== 'string') {
    return next(createHttpError(401, 'Authorization header must be of type Bearer'));
  }

  // Ищем сессию, соответствующую токену доступа
  const session = await Session.findOne({ accessToken });

  if (!session) {
    return next(createHttpError(401, 'Session not found')); // Если сессия не найдена, возвращаем ошибку 401
  }

  // Проверяем, не истек ли срок действия токена
  if (new Date() > new Date(session.accessTokenValidUntil)) {
    return next(createHttpError(401, 'Access token expired')); // Если истек, возвращаем ошибку 401
  }

  // Получаем пользователя по userId из сессии
  const user = await User.findById(session.userId);

  if (!user) {
    return next(createHttpError(401, 'User not found')); // Если пользователь не найден, возвращаем ошибку 401
  }

  // Сохраняем данные пользователя в req.user для доступа в последующих middleware
  req.user = { _id: user._id, name: user.name };

  next(); // Передаем управление следующему middleware
}
