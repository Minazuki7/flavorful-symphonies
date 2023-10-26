import { ObjectType, Field, ID, Float, Int, InputType } from 'type-graphql';

@ObjectType()
class UserProfileType {
  @Field(() => ID)
  _id: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  profilePicture?: string;

  @Field(() => [String], { nullable: true })
  preferences?: string[];

  @Field(() => [String], { nullable: true })
  dietaryRestrictions?: string[];

  @Field(() => Float, { nullable: true })
  averageRating?: number;

  @Field(() => Int, { nullable: true })
  likesCount?: number;

  @Field(() => Int, { nullable: true })
  followersCount?: number;
}

@ObjectType()
class UserType {
  @Field(() => ID)
  _id: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
  @Field()
  isActive: boolean;

  @Field(() => [String], { nullable: true })
  roles?: string[];

  @Field(() => UserProfileType, { nullable: true })
  profile?: UserProfileType;
}

@InputType()
class CreateUserProfileInputType {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  profilePicture?: string;

  @Field(() => [String], { nullable: true })
  preferences?: string[];

  @Field(() => [String], { nullable: true })
  dietaryRestrictions?: string[];

  @Field(() => Float, { nullable: true })
  averageRating?: number;

  @Field(() => Int, { nullable: true })
  likesCount?: number;

  @Field(() => Int, { nullable: true })
  followersCount?: number;
}

@InputType()
class CreateUserInputType {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => [String], { nullable: true })
  roles?: string[];

  @Field(() => CreateUserProfileInputType, { nullable: true })
  profile?: CreateUserProfileInputType;
}

export {
  UserType,
  CreateUserInputType,
  CreateUserProfileInputType,
  UserProfileType,
};
