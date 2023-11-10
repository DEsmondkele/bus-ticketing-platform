import { Router } from 'express';
import * as ticketController from '../controller/ticketController';

const router = Router();

router.post('/pay', ticketController.payForTicket);
router.post('/deposit',ticketController.deposit);//this is a dummy payment route!
export default router;
