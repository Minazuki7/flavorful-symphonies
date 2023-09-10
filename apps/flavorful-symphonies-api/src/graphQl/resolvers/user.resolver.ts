import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { CreateUserInputType, UserType } from '../types';
import User from '../../database/models/user';

@Resolver()
class UserResolver {
  @Query(() => UserType)
  async user(@Arg('id') id: string) {
    const user = await User.findById(id);
    return user || null;
  }
  @Query(() => String)
  async test() {
    return 'Appoloo linked';
  }
}

export default UserResolver;
