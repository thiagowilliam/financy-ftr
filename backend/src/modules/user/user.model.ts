import { Field, ID, ObjectType } from "type-graphql";

// O campo "password" nao possui @Field e por isso nao existe no schema GraphQL.
@ObjectType({ description: "Usuario autenticavel da aplicacao." })
export class User {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  email!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}
