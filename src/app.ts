import bcrypt from 'bcrypt';
import express, { Application, Request, Response } from 'express';
import { Guid } from 'guid-typescript';
import { requestLoggerMiddleware } from './middleware/request-logger';
import { CustomRequest } from './models/custom-request';
import { LoginRequest } from './models/login.req';
import { User } from './models/user';

const PORT = 3000;

const app: Application = express();
app.use(express.json());
app.use(requestLoggerMiddleware);

const users: User[] = [];

app.get('/users', (_req: Request, res: Response<User[]>) => {
  res.send(users);
});

app.post('/users', async (req: CustomRequest<User>, res: Response) => {
  const user = users.find((user) => user.name === req.body.name);

  if (user) {
    return res.status(400).send('User already exists');
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user: User = {
      id: Guid.create().toString(),
      name: req.body.name,
      password: hashedPassword,
    };
    users.push(user);
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

app.post(
  '/users/login',
  async (req: CustomRequest<LoginRequest>, res: Response) => {
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
  }
);

app.listen(PORT, () => console.log('Server running'));
