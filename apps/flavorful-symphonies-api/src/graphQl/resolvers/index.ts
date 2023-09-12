import { buildSchema } from 'type-graphql';
import UserResolver from './user.resolver';

const schema = buildSchema({
  resolvers: [UserResolver],
});
export default schema;
