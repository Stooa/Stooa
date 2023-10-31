/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import express from 'express';
import proxy from 'express-http-proxy';
import { loadEnvConfig } from '@next/env';

import cors from 'cors';
import { createMiddleware } from '@mswjs/http-middleware';
import { handlers } from './handlers';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const app = express();
const port = 9090;

app.use(cors({ origin: '*', optionsSuccessStatus: 200, credentials: true }));
app.use(express.json());
app.get('/', (req, res) => {
  res.send('ok');
});
app.use(createMiddleware(...handlers));
app.use(proxy(process.env.NEXT_PUBLIC_API_DOMAIN));
app.listen(port, () => console.log(`Mock server is running on port: ${port}`));
