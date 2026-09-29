import { Field, ID, Int, ObjectType } from "type-graphql";
import { TransactionType } from "../../shared/enums/transaction-type.enum.js";

@ObjectType({ description: "Categoria de receitas ou despesas do usuario." })
export class Category {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => TransactionType)
  type!: TransactionType;

  @Field(() => String, {
    nullable: true,
    description: "Chave do icone exibido no frontend, por exemplo utensils.",
  })
  icon?: string | null;

  @Field(() => String, { nullable: true, description: "Cor hexadecimal, por exemplo #22C55E." })
  color?: string | null;

  @Field(() => Int, { description: "Quantidade de transacoes vinculadas a categoria." })
  transactionCount?: number;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}
