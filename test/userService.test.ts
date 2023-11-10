import { Request, Response } from 'express';
import * as userService from '../src/service/userService';
import bcrypt from 'bcrypt';
import{
  createUser, loginUser,creditUser, getMyBalance, getUserTransactions, sendCredit} from '../src/controller/userController';


  jest.mock('../src/service/userService', () => {
    return {
      ...jest.requireActual('../src/service/userService'),
      createUser: jest.fn(),
      loginUser: jest.fn(),
      creditUser: jest.fn(),
      getBalance: jest.fn(),
      getUserTransactions: jest.fn(),
      sendCredit: jest.fn(),
      findUserById: jest.fn(),
      findUserByUsername: jest.fn(),
      updateUserBalance: jest.fn(),
      getUserBalance: jest.fn(),
    
    };
  });
  

  jest.mock('bcrypt', () => {
    return {
      compare: jest.fn(),
    };
  });
  
const res = {
  json: jest.fn(),
  status: jest.fn(() => res),
} as unknown as Response;

describe('User Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const req = {
        body: { username: 'testuser', password: 'password', balance: 100 },
      } as Request;

      (userService.createUser as jest.Mock).mockResolvedValue({ userId: 3, token: 'mocked-token' });

      await createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      // expect(res.json).toHaveBeenCalledWith({ userId: 3, token: 'mocked-token' });
    });
  
    it('should handle errors during user creation', async () => {
      const req = {
        body: { username: 'testuser', password: 'password', balance: 100 },
      } as Request;
  
      
      (userService.createUser as jest.Mock).mockRejectedValue(new Error('User creation failed'));
  

      await createUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'User creation failed' });
    });
  });
describe('loginUser', () => {
    it('should log in a user successfully', async () => {
      const req = { body: { username: 'testuser', password: 'password' } } as Request;
      const user = { username: 'testuser', password: 'hashed_password' };
      (userService.findUserByUsername as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
  
      await loginUser(req, res);
  
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ token: expect.any(String) });
    });

    it('should handle login failure due to incorrect password', async () => {
      const req = { body: { username: 'testuser', password: 'incorrect_password' } } as Request;
      const user = { username: 'testuser', password: 'hashed_password' };
      (userService.findUserByUsername as jest.Mock).mockResolvedValue(user);
      bcrypt.compare = jest.fn().mockResolvedValue(false);
    
      await loginUser(req, res);
    
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Authentication failed' });
    });

    it('should handle login failure due to user not found', async () => {
      const req = { body: { username: 'nonexistent_user', password: 'password' } } as Request;
     (userService.findUserByUsername as jest.Mock).mockResolvedValue(null);
    
      await loginUser(req, res);
    
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Authentication failed' });
    });

    it('should handle errors during login', async () => {
      const req = { body: { username: 'testuser', password: 'password' } } as Request;
      (userService.findUserByUsername as jest.Mock).mockRejectedValue(new Error('Login failed'));
    
      await loginUser(req, res);
    
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Login failed' });
    });
});

describe('creditUser', () => {
  it('should credit a user successfully', async () => {
    const req = { body: { userId: 1, amount: 50 } } as Request;
    const user = { id: 1, balance: 100 }; // Assuming user with id 1 and balance 100
    (userService.findUserById as jest.Mock).mockResolvedValue(user);

    await creditUser(req, res);
    expect(userService.findUserById).toHaveBeenCalledWith(1);
    expect(userService.updateUserBalance).toHaveBeenCalledWith(1, 150);
    expect(res.json).toHaveBeenCalledWith({ balance: 150 });
  });

  it('should handle user not found', async () => {
    const req = {
      body: { userId: 1, amount: 50 },
    } as Request;
    (userService.findUserById as jest.Mock).mockResolvedValue(null);
  
    await creditUser(req, res);
  
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
  });

  it('should handle errors during user credit', async () => {
    const req = {
      body: { userId: 1, amount: 50 },
    } as Request;
    (userService.findUserById as jest.Mock).mockRejectedValue(new Error('Credit operation failed'));
  
    await creditUser(req, res);
  
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Credit operation failed' });
  });
  
});

describe('getBalance', () => {
  it('should get user balance successfully', async () => {
    const req = { params: { userId: '1' } } as unknown as Request;
    
    (userService.getUserBalance as jest.Mock).mockResolvedValue(100);

    await getMyBalance(req, res);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ balance: 100 });
  });

  it('should handle errors during balance retrieval', async () => {
    const req = { params: { userId: '1' } } as unknown as Request;
    (userService.getUserBalance as jest.Mock).mockRejectedValue(new Error('Balance retrieval failed'));

    await getMyBalance(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Balance retrieval failed' });
  });

});
describe('getUserTransactions', () => {
  it('should get user transactions successfully', async () => {
    const req = { params: { userId: '1' } } as unknown as Request;
    (userService.getUserTransactions as jest.Mock).mockResolvedValue([{ transaction: 'data' }]);

    await getUserTransactions(req, res);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([{ transaction: 'data' }]);
  });

  it('should handle errors during transaction retrieval', async () => {
    const req = { params: { userId: '1' } } as unknown as Request;
    (userService.getUserTransactions as jest.Mock).mockRejectedValue(new Error('Transaction retrieval failed'));

    await getUserTransactions(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Transaction retrieval failed' });
  });
});
describe('sendCredit', () => {
  it('should send credit successfully', async () => {
    const req = {
      body: { fromUserId: 1, toUserId: 2, amount: 50 },
    } as Request;
    (userService.findUserById as jest.Mock).mockResolvedValue({ balance: 100 });
    (userService.sendCredit as jest.Mock).mockResolvedValue({ transaction: 'data' });

    await sendCredit(req, res);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ transaction: 'data' }); // Update this line
  });

  it('should handle sender not found', async () => {
    const req = {
      body: { fromUserId: 1, toUserId: 2, amount: 50 },
    } as Request;
    (userService.findUserById as jest.Mock).mockResolvedValue(null);

    await sendCredit(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Sender not found' });
  });

  it('should handle recipient not found', async () => {
    const req = {
      body: { fromUserId: 1, toUserId: 2, amount: 50 },
    } as Request;
    (userService.findUserById as jest.Mock).mockResolvedValue({ balance: 100 });
    (userService.sendCredit as jest.Mock).mockRejectedValue(new Error('Recipient not found'));

    await sendCredit(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Credit sending failed' });
  });

    it('should handle insufficient balance', async () => {
    const req = {
      body: { fromUserId: 1, toUserId: 2, amount: 150 },
    } as Request;
    (userService.findUserById as jest.Mock).mockResolvedValue({ balance: 100 });

    await sendCredit(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Credit sending failed' });
  });

});

});









//   it('should handle errors during credit sending', async () => {
//     const req = {
//       body: { fromUserId: 1, toUserId: 2, amount: 50 },
//     } as Request;
//     (userService.findUserById as jest.Mock).mockResolvedValue({ balance: 100 });
//     (userService.sendCredit as jest.Mock).mockRejectedValue(new Error('Credit sending failed'));

//     await sendCredit(req, res);

//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.json).toHaveBeenCalledWith({ error: 'Credit sending failed' });
//   });
// });




  










 




