import 'reflect-metadata';
import express from 'express';
import * as path from 'path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';

import connectToDatabase from './mongoose';
import { graphQlSchema } from '@graphQl/index';
import { port } from './vars';

const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to flavorful-symphonies-api!' });
});

async function startServer() {
  try {
    await connectToDatabase();

    const PORT = port || 3333;

    const server = new ApolloServer({
      schema: await graphQlSchema,
    });

    await server.start();

    app.use('/graphql', cors(), express.json(), expressMiddleware(server));

    const expressServer = app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });

    expressServer.on('error', console.error);
  } catch (err) {
    console.error('Startup error:', err);
  }
}

export default startServer;
