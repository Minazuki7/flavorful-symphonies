import { ObjectType, Field } from 'type-graphql';
import { UserType } from './user';
import { TokensType } from './token';

@ObjectType()
class AuthType {
  @Field(() => UserType, { nullable: true })
  user: UserType;
  @Field(() => TokensType, { nullable: true })
  token: TokensType;
}

export { AuthType };
