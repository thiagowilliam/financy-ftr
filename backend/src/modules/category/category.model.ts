import { Field, ID, ObjectType } from "type-graphql";
import { TransactionType } from "../../shared/enums/transaction-type.enum.js";

@ObjectType({ description: "Categoria de receitas ou despesas do usuario." })
export class Category {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => TransactionType)
  type!: TransactionType;

  @Field(() => String, { nullable: true, description: "Cor hexadecimal, por exemplo #22C55E." })
  color?: string | null;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}
