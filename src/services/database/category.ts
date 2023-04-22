import { Category } from "../../models/Category";
import { ListCategoryMapper } from "../../utils/dto/category";
import { IPostCategoryPayload } from "../../utils/interface/category";
import { v4 as uuidv4 } from "uuid";

export class CategoryService {
  model: Category;

  constructor() {
    this.model = new Category();
  }

  async getAllCategories() {
    const data = (await this.model.getAllCategories()).map(ListCategoryMapper);
    return data;
  }

  async addNewCategory(payload: IPostCategoryPayload) {
    const categoryId = uuidv4();
    return await this.model.addNewCategory(categoryId, payload);
  }
}
