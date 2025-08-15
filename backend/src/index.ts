import type { Request, Response, NextFunction } from 'express';
import express from 'express';
import dotenv from 'dotenv';
import { createCandidateController } from './infrastructure/configuration/dependencyContainer';

dotenv.config();

export const app = express();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.type('text/plain');
  res.status(500).send('Something broke!');
});

const router = express.Router();

router.post('/api/v1/candidates', (req, res) => createCandidateController.handle(req, res));

app.use(router);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}
