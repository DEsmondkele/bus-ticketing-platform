import { Request, Response } from 'express';
import * as ticketService from '../service/ticketService';
import * as userService from '../service/userService';

export const payForTicket = async (req: Request, res: Response) => {
  try {
    const { userId, ticketId } = req.body;
    const userBalance = await userService.getUserBalance(userId);
    const ticket = await ticketService.findTicketById(ticketId);

    if (!ticket) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }

    if (userBalance < ticket.price) {
      res.status(400).json({ error: 'Insufficient balance to purchase the ticket' });
      return;
    }

    const transaction = {
      user_id: userId,
      ticket_id: ticketId,
      amount: -ticket.price,
      date: new Date().toISOString(),
    };

    const transactionId = await ticketService.createTransaction(transaction);
    const newBalance = userBalance - ticket.price;
    await userService.updateUserBalance(userId, newBalance);

    const newTicket = await ticketService.createTicket(userId);
    res.json({ transactionId, newTicket, newBalance });
  } catch (error) {
    res.status(500).json({ error: 'Payment failed' });
  }
};

export const deposit = async (req: Request, res: Response) => {
  try {
    const { userId, amount } = req.body;

    // Check if the user ID and amount are provided
    if (!userId || !amount) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    const paymentSuccessful = await ticketService.creditMyAccount(userId, amount);

    if (paymentSuccessful) {
      res.json({ message: 'Payment successful' });
    } else {
      res.status(400).json({ error: 'Payment failed' });
    }
  } catch (error) {
    console.error('Error making a payment:', error);
    res.status(500).json({ error: 'Payment failed' });
  }
};