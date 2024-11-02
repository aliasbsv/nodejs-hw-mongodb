import { promises as fs } from 'node:fs';
import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';
import createHttpError from 'http-errors';
import { FIFTEEN_MINUTES, SMTP, THIRTY_DAY, RESET_PWD_PATH } from '../constants/index.js';
import jwt from 'jsonwebtoken';
import { sendMail } from '../utils/sendMail.js';
import handlebars from 'handlebars';
import { env } from '../utils/env.js';

/* const RESET_PASSWORD_TEMPLATE = fs.readFileSync(path.resolve('src/templates/reset-password.hbs'), {
  encoding: 'utf-8',
}); */

/**************** User Registration *****************/
export async function registerUser(payload) {
  const user = await User.findOne({ email: payload.email });
  if (user !== null) {
    throw createHttpError(409, 'Email  in use');
  }
  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  return await User.create({
    ...payload,
    password: encryptedPassword,
  });
}

/************************ User Login *************************/
export async function loginUser(email, password) {
  const user = await User.findOne({ email });
  if (user === null) {
    throw createHttpError(401, 'Email or password is incorrect');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch !== true) {
    throw createHttpError(401, 'Email or password is incorrect');
  }

  await Session.deleteOne({ userId: user._id });

  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  return await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAY),
  });
}

/***************** User Logout *****************/
export function logoutUser(sessionId) {
  return Session.deleteOne({ _id: sessionId });
}

/***************** User Refresh *****************/
export async function refreshSession(sessionId, refreshToken) {
  const session = await Session.findById(sessionId);
  if (session === null) {
    throw createHttpError(401, 'Session not found');
  }

  if (session.refreshToken !== refreshToken) {
    throw createHttpError(401, 'Session not found');
  }

  if (new Date() > session.refreshTokenValidUntil) {
    throw createHttpError(401, 'Refresh token expired');
  }

  await Session.deleteOne({ _id: session._id });
  return Session.create({
    userId: session.userId,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAY),
  });
}

/********* Сreating a token and sending a link to change the password to the user's e-mail **********/
export async function requestResetPassword(email) {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign({ sub: user._id, email: user.email }, env('JWT_SECRET'), {
    expiresIn: '5m',
  });

  const templateSource = await fs.readFile(RESET_PWD_PATH, 'utf-8');

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-pwd?token=${resetToken}`,
  });

  try {
    await sendMail({
      from: SMTP.SMTP_FROM,
      to: email,
      subject: 'Reset Password',
      html,
    });
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
}

/* export async function requestResetPassword(email) {
  const user = await User.findOne({ email });
  if (user === null) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign({ sub: user._id, email: user.email }, env('JWT_SECRET'), {
    expiresIn: '5m',
  });

  const template = handlebars.compile(RESET_PASSWORD_TEMPLATE);
  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-pwd?token=${resetToken}`,
  });

  try {
    await sendMail({
      from: SMTP.SMTP_FROM,
      to: email,
      subject: 'Reset Password',
      html,
    });
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
} */

/***************  Reset user password ****************/
export async function resetPassword(password, token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.sub, email: decoded.email });
    if (user === null) {
      throw createHttpError(404, 'User not found');
    }
    await Session.deleteOne({ userId: user._id });
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(user._id, { password: encryptedPassword });
  } catch (error) {
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      throw createHttpError(401, 'Token is expired or invalid.');
    }
    throw error;
  }
}
