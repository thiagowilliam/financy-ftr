import { Field, InputType } from "type-graphql";
import { TransactionType } from "../../../shared/enums/transaction-type.enum.js";

@InputType()
export class CreateCategoryInput {
  @Field(() => String)
  name!: string;

  @Field(() => TransactionType)
  type!: TransactionType;

  @Field(() => String, { nullable: true, description: "Cor hexadecimal, por exemplo #22C55E." })
  color?: string | null;
}
