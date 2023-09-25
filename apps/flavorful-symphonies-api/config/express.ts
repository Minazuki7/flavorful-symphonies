import 'reflect-metadata';
import express from 'express';
import * as path from 'path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import passport from 'passport';
import connectToDatabase from './mongoose';
import { graphQlSchema } from '@graphQl/index';
import { port } from './vars';
import authorization, { decodeToken } from '@middlewares/auth';
import strategies from '@config/passport';
import { MyContext } from '@graphQl/services/auth.service';

const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to flavorful-symphonies-api!' });
});

async function startServer() {
  try {
    await connectToDatabase();

    const PORT = port || 3333;

    const server = new ApolloServer<MyContext>({
      schema: await graphQlSchema,
    });
    app.use(passport.initialize());
    passport.use('jwt', strategies.jwt);
    app.use(authorization);

    await server.start();

    app.use(
      '/graphql',
      cors<cors.CorsRequest>(),
      express.json(),
      expressMiddleware(server, {
        context: async ({ req }) => {
          let error: string;
          const token = req.headers.authorization;
          if (!req.headers.authorization) {
            {
              error = 'Unauthorized: JWT token missing';
            }
          }
          const user = await decodeToken(token);

          return { token, user, error };
        },
      })
    );

    const expressServer = app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });

    expressServer.on('error', console.error);
  } catch (err) {
    console.error('Startup error:', err);
  }
}

export default startServer;
