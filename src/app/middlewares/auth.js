import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provider.' });
  }

  try {
    const decode = await promisify(jwt.verify)(authHeader, authConfig.secret);
    req.userId = decode.id;
  } catch (error) {
    return res.json({ error: 'Token invalid!' });
  }

  return next();
};
