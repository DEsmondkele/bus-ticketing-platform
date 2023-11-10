import { Request, Response } from 'express';
import * as userService from '../service/userService';
import bcrypt from 'bcrypt';
import { generateToken } from '../config/authUtils';
import { UserCreateDto } from '../dto/userCreateDto';

export const createUser = async (req: Request, res: Response) => {
  try {
    const userData: UserCreateDto = req.body;

    if ( !userData ||!userData.username || !userData.password || !userData.balance ===undefined ) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    const newUser = await userService.createUser(userData);
    res.status(201).send({ data: newUser, message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:');
    res.status(500).json({ error: 'User creation failed' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await userService.findUserByUsername(username);

    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const creditUser = async (req: Request, res: Response) => {
  try {
    const { userId, amount } = req.body;
    const user = await userService.findUserById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newBalance = user.balance + amount;
    await userService.updateUserBalance(userId, newBalance);
    res.json({ balance: newBalance });
  } catch (error) {
    console.error('Error crediting user:', error);
    res.status(500).json({ error: 'Credit operation failed' });
  }
};

export const getMyBalance = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const balance = await userService.getUserBalance(userId);
    res.json({ balance });
  } catch (error) {
    console.error('Error retrieving balance:', error);
    res.status(500).json({ error: 'Balance retrieval failed' });
  }
};

export const getUserTransactions = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const transactions = await userService.getUserTransactions(userId);
    res.json(transactions);
  } catch (error) {
    console.error('Error retrieving user transactions:', error);
    res.status(500).json({ error: 'Transaction retrieval failed' });
  }
};

export const sendCredit = async (req: Request, res: Response) => {
  try {
    const { fromUserId, toUserId, amount } = req.body;
    const transaction = await userService.sendCredit(fromUserId, toUserId, amount);
    res.json(transaction);
  } catch (error) {
    console.error('Error sending credit:', error);
    res.status(500).json({ error: 'Credit sending failed' });
  }
};
