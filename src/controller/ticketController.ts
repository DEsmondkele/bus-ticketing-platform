import { Request, Response } from 'express';
import * as ticketService from '../service/ticketService';
import * as userService from '../service/userService';

export const payForTicket = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId, 10); // Get the userId from the URL parameter

    if (isNaN(userId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    const userBalance = await userService.getUserBalance(userId);
    const newTicket = await ticketService.createTicket(userId);

    if (!newTicket) {
      res.status(500).json({ error: 'Failed to create a new ticket' });
      return;
    }

    const ticketPrice = newTicket.price;
    const ticketId = newTicket.ticketNumber;

    if (userBalance < ticketPrice) {
      res.status(400).json({ error: 'Insufficient balance to purchase the ticket' });
      return;
    }

    const transaction = {
      user_id: userId,
      ticket_id: ticketId,
      amount: -ticketPrice,
      date: new Date().toISOString(),
    };

    const transactionId = await ticketService.createTransaction(transaction);
    const newBalance = userBalance - ticketPrice;
    await userService.updateUserBalance(userId, newBalance);
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