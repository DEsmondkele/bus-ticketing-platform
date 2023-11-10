import db from '../config/dbconfig';
import axios from 'axios';
import { Ticket } from '../model/ticketModel';
import { generateUniqueTicketNumber } from '../config/generateTicket';
import { findUserById, updateUserBalance } from './userService';

export const createTicket = async (userId: number): Promise<Ticket | null> => {
  try {
    
    const user = await findUserById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const ticket: Omit<Ticket, 'id'> = {
      ticketNumber: generateUniqueTicketNumber(),
      dateAndTime: new Date().toISOString(),
      price: /* using a fix dummy price */ 100.0,
      passengerName: user.username, // passenger Name.
    };

    const [ticketId] = await db('ticket').insert(ticket);

    const createdTicket = await findTicketById(ticketId);

    return createdTicket;
  } catch (error) {
    throw new Error('Ticket creation failed');
  }
};



  export const findTicketById = async (ticketId: number): Promise<Ticket | null> => {
    const ticket = await db('ticket').where('id', ticketId).first();
    return ticket || null;
  };
  

  export const createTransaction = async (transaction: any): Promise<number> => {
    const [transactionId] = await db('transactions').insert(transaction);
    return transactionId;
  };
  

  export const getUserTransactions = async (userId: number): Promise<any[]> => {
    const transactions = await db('transactions').where('user_id', userId);
    return transactions;
  };
  

export const creditMyAccount = async (userId: number, amount: number): Promise<boolean> => {
  try {
    const dummyApiKey = 'YOUR_DUMMY_API_KEY';

    const response = await axios.post('https://dummy-payment-gateway.com/pay', {
      apiKey: dummyApiKey,
      userId,
      amount,
    });

    if (response.data.success) {
    
      const user = await findUserById(userId);
      if (user) {
        const newBalance = user.balance + amount;
        await updateUserBalance(userId, newBalance);
        return true; 
      }
    }

    return false; 
  } catch (error) {
    console.error('Payment failed:', error);
    return false; // Payment failed
  }
};

