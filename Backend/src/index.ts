import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { MikroORM } from '@mikro-orm/mysql';
import config from './mikro-orm.config.js';
import { User } from './entities/User.js';

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json());

app.get('/', async (_req: Request, res: Response) => {
    const orm = await MikroORM.init(config);
    const userRepository = orm.em.getRepository(User);
    const count = await userRepository.count();
    await orm.close();

    res.json({ message: 'Backend ready', userCount: count });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
