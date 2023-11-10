import { Router } from 'express';
import * as userController from '../controller/userController';


const router = Router();

router.post('/create', userController.createUser);
router.post('/login', userController.loginUser);
router.post('/credit', userController.creditUser);
router.get('/balance/:userId', userController.getMyBalance);
router.get('/transactions/:userId', userController.getUserTransactions);
router.post('/send', userController.sendCredit)

export default router;
