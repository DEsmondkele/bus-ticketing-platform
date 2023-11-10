import { Router } from 'express';
import * as userController from '../controller/userController';


const router = Router();

router.post('/create', userController.createUser);
router.post('/login', userController.loginUser);
router.post('/credit', userController.creditUser);
router.get('/balance', userController.getMyBalance);
router.get('/transactions', userController.getUserTransactions);
router.post('/send', userController.sendCredit)

export default router;
