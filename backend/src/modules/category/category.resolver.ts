import { Arg, Authorized, Ctx, ID, Mutation, Query, Resolver } from "type-graphql";
import type { Context } from "../../graphql/context.js";
import { requireUserId } from "../../utils/require-user-id.js";
import { Category } from "./category.model.js";
import { categoryService } from "./category.service.js";
import { CreateCategoryInput } from "./dtos/create-category.input.js";
import { UpdateCategoryInput } from "./dtos/update-category.input.js";

@Authorized()
@Resolver(() => Category)
export class CategoryResolver {
  @Query(() => [Category], { description: "Lista as categorias do usuario autenticado." })
  async categories(@Ctx() ctx: Context): Promise<Category[]> {
    return categoryService.list(requireUserId(ctx));
  }

  @Query(() => Category, { description: "Busca uma categoria do usuario pelo id." })
  async category(@Arg("id", () => ID) id: string, @Ctx() ctx: Context): Promise<Category> {
    return categoryService.findById(requireUserId(ctx), id);
  }

  @Mutation(() => Category)
  async createCategory(
    @Arg("data", () => CreateCategoryInput) data: CreateCategoryInput,
    @Ctx() ctx: Context,
  ): Promise<Category> {
    return categoryService.create(requireUserId(ctx), data);
  }

  @Mutation(() => Category)
  async updateCategory(
    @Arg("id", () => ID) id: string,
    @Arg("data", () => UpdateCategoryInput) data: UpdateCategoryInput,
    @Ctx() ctx: Context,
  ): Promise<Category> {
    return categoryService.update(requireUserId(ctx), id, data);
  }

  @Mutation(() => Boolean)
  async deleteCategory(@Arg("id", () => ID) id: string, @Ctx() ctx: Context): Promise<boolean> {
    return categoryService.delete(requireUserId(ctx), id);
  }
}
