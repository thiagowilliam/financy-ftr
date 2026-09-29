import { Field, InputType } from "type-graphql";
import { TransactionType } from "../../../shared/enums/transaction-type.enum.js";

@InputType()
export class UpdateCategoryInput {
  @Field(() => String, { nullable: true })
  name?: string | null;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType | null;

  @Field(() => String, { nullable: true, description: "Chave do icone, por exemplo utensils." })
  icon?: string | null;

  @Field(() => String, { nullable: true, description: "Cor hexadecimal, por exemplo #22C55E." })
  color?: string | null;
}
