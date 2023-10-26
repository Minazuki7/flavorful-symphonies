import { ObjectType, Field } from 'type-graphql';
import { UserType } from './user';

@ObjectType()
class TokensType {
  @Field({ nullable: true })
  accessToken?: string;

  @Field({ nullable: true })
  refreshToken?: string;

  @Field({ nullable: true })
  tokenType?: string;
  @Field({ nullable: true })
  expiresIn?: string;
  @Field(() => UserType, { nullable: true })
  user: UserType;
}

export { TokensType };
