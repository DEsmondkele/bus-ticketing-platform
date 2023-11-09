import db from '../config/dbconfig';
import { Ticket } from '../model/ticketModel';
import { generateUniqueTicketNumber } from '../config/generateTicket';

export const createTicket = async (passengerName: string,price: GLfloat): Promise<Ticket> => {
    const ticket: Omit<Ticket, 'id'> = {
        ticketNumber: generateUniqueTicketNumber(),
        dateAndTime: new Date().toISOString(),
        price,
        passengerName,
      };
      await db('ticket').insert(ticket);
      return ticket;

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
  

// more ticket-related functions...
