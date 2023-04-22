import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import db from "../database";
import { IPostCategoryPayload } from "../utils/interface/category";
import { BadRequestError } from "../exceptions/BadRequestError";
import { InternalServerError } from "../exceptions/InternalError";

export class Category {
  async addNewCategory(categoryId: string, payload: IPostCategoryPayload) {
    try {
      return await db.category.create({
        data: { name: payload.name, id: categoryId },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new BadRequestError(error.message);
      } else if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
    }
  }

  async getAllCategories() {
    return await db.category.findMany();
  }
}
