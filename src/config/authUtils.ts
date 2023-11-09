require('dotenv').config();
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET as string;

export const generateToken = (payload: any) => {
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return null;
  }
};

export default { generateToken, verifyToken };
