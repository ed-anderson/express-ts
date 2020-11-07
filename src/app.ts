import bcrypt from 'bcrypt';
import express, { Application, Request, Response } from 'express';
import { LoginRequest } from './models/login.req';
import { User } from './models/user';

const PORT = 3000;

const app: Application = express();
app.use(express.json());

const users: User[] = [];

app.get('/users', (req: Request, res: Response<User[]>) => {
  res.send(users);
});

app.post('/users', async (req: Request<User>, res: Response) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user: User = {
      name: req.body.name,
      password: hashedPassword,
    };
    users.push(user);
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

app.post('/users/login', async (req: Request<LoginRequest>, res: Response) => {
  const user = users.find((user) => user.name === req.body.username);

  if (!user) {
    return res.status(400).send('User not found');
  }

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send('Success');
    } else {
      res.send('Not allowed');
    }
  } catch {
    res.status(500).send();
  }
});

app.listen(PORT, () => console.log('Server running'));
