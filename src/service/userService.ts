import db from '../config/dbconfig';
import { User } from '../model/userModel';
import bcrypt from 'bcrypt';
import { generateToken } from '../config/authUtils';
import { Transaction } from '../model/transactionModel';

export const createUser = async (user: User) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
  const [userId] = await db('user').insert(user);
  const token = generateToken({ id: userId, username: user.username });
  return { userId, token };
};

export const findUserByUsername = async (username: string): Promise<User | null> => {
  const user = await db('user').where('username', username).first();
  return user || null;
};

export const updateUserBalance = async (userId: number, newBalance: number): Promise<void> => {
  await db('user').where('id', userId).update({ balance: newBalance });
};

export const getUserBalance = async (userId: number) => {
  const user = await db('user').where('id', userId).first();
  if (user) {
    return user.balance;
  } else {
    throw new Error('User not found');
  }
};

export const getUserTransactions = async (id: number): Promise<Transaction[]> => {
  const senderTransactions = db('user')
    .join('transaction', 'user.id', 'transaction.from_user_id')
    .select('transaction.*')
    .where('user.id', id);

  const receiverTransactions = db('user')
    .join('transaction', 'user.id', 'transaction.to_user_id')
    .select('transaction.*')
    .where('user.id', id);

  return senderTransactions.union(receiverTransactions);
};



export const sendCredit = async (senderId: number, receiverId: number, amount: number): Promise<Transaction> => {
  const fromUser = await db('user').where('id', senderId).first();
  if (!fromUser) {
    throw new Error('Sender not found');
  }

  const toUser = await db('user').where('id', receiverId).first();
  if (!toUser) {
    throw new Error('Recipient not found');
  }

  if (fromUser.balance < amount) {
    throw new Error('Insufficient balance');
  }

  const transaction: Transaction = {
    id: 0,
    from_user_id: senderId,
    to_user_id: receiverId,
    amount,
    date: new Date().toISOString(),
  };

  const [transactionId] = await db('transaction').insert(transaction);
  transaction.id = transactionId;

  await updateUserBalance(senderId, fromUser.balance - amount);
  await updateUserBalance(receiverId, toUser.balance + amount);

  return transaction;
};

export const findUserById = async (userId: number): Promise<User | null> => {
  const user = await db('user').where('id', userId).first();
  return user || null;
};

/** To do: other methods... */
