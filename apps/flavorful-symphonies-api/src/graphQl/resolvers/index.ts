import { buildSchema } from 'type-graphql';
import UserResolver from './user.resolver';
import AuthResolver from './auth.resolver';

const schema = buildSchema({
  resolvers: [UserResolver, AuthResolver],
});
export default schema;
