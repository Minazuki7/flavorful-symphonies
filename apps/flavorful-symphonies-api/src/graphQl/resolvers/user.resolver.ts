import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';
import { CreateUserInputType, UserType } from '../types';
import User from '../../models/user';
import { createUser } from '@graphQl/services/user.service';
import { MyContext } from '@graphQl/services/auth.service';

import { Authorized } from '@middlewares/auth';

@Resolver()
class UserResolver {
  @Query(() => UserType)
  async user(@Arg('id') id: string) {
    const user = await User.findById(id);
    return user || null;
  }
  @Query(() => String)
  @Authorized(['Admin', 'Moderator'])
  async test(@Ctx() { user, error }: MyContext) {
    if (error) {
      throw new Error(error); // Handle the error in the resolver
    }

    // The user is available in context if authentication passed
    return `Appoloo linked, User: ${user.username}, ROLE ${user.roles}`;
  }

  @Mutation(() => UserType)
  async createUser(
    @Arg('CreateUserInputType') CreateUserInputType: CreateUserInputType
  ) {
    return createUser(CreateUserInputType);
  }
}

export default UserResolver;
