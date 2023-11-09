import express, {Request, Response, Application } from 'express';
import ticketRoutes from './src/route/ticketRoutes';
import userRoutes from './src/route/userRoutes';
import db from './src/config/dbconfig';

const app: Application = express();
const port = process.env.PORT || 3000;


app.use((req, res, next) => {
  console.log('Received request:', req.method, req.url);
  next();
});
app.use(express.json());
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tickets', ticketRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.send('Welcome to ShipBubble');
});
 app.get('/testdbconnection', async (req: Request, res: Response) => {
  try {
    const result = await db('user').select('id').limit(1);
    if (result.length > 0) {
      res.status(200).send('Database connection is working.');
    } else {
      res.status(500).send('No data retrieved from the database.');
    }
  } catch (error) {
    res.status(500).send('Error connecting to the database: ' + error);
  }
});


app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
