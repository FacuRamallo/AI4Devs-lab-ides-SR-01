import 'tsconfig-paths/register.js';
import express from 'express';
import dotenv from 'dotenv';
import type { Request, Response, NextFunction } from 'express';
import { prisma, createCandidateController, uploadCandidateCvController } from '@infrastructure/configuration/dependencyContainer.js';
import { exec } from 'child_process';
import multer from 'multer';

dotenv.config();

const app = express();
app.use(express.json());
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
const upload = multer();

router.post('/api/v1/candidates', (req, res) => createCandidateController.handle(req, res));
router.post('/api/v1/candidates/:candidateId/cv', upload.single('file'), (req, res) => uploadCandidateCvController.handle(req, res));

app.use(router);

async function runMigrations() {
  return new Promise<void>((resolve, reject) => {
    exec('npx prisma migrate deploy', (error, stdout, stderr) => {
      if (error) {
        console.error(`Migration error: ${stderr}`);
        reject(error);
      } else {
        console.log(`Migration output: ${stdout}`);
        resolve();
      }
    });
  });
}

async function main() {
  try {
    console.log('Running database migrations...');
    await runMigrations();
    console.log('Migrations applied successfully.');

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to apply migrations:', error);
    process.exit(1); // Exit the application if migrations fail
  }
}

if (process.env.NODE_ENV !== 'test') {
  main();
} else {
  console.log('Skipping migrations in test environment.');
}

export { app };
