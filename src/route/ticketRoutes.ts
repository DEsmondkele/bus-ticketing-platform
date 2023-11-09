import { Router } from 'express';
import * as ticketController from '../controller/ticketController';

const router = Router();

router.post('/pay', ticketController.payForTicket);

export default router;
