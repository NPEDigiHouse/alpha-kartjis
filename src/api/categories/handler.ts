import { Request, Response, NextFunction } from "express";
import { CategoryService } from "../../services/database/category";
import { constants, createResponse } from "../../utils";
import { CategoryPayloadValidator } from "../../validator/categories";
import { IPostCategoryPayload } from "../../utils/interface/category";

export class CategoryHandler {
  private service: CategoryService;
  private categoryValidator: CategoryPayloadValidator;

  constructor() {
    this.service = new CategoryService();
    this.categoryValidator = new CategoryPayloadValidator();

    this.getCategories = this.getCategories.bind(this);
    this.postCategories = this.postCategories.bind(this);
  }

  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await this.service.getAllCategories();

      return res.json(
        createResponse(constants.SUCCESS_RESPONSE_MESSAGE, categories)
      );
    } catch (error) {
      return next(error);
    }
  }

  async postCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as IPostCategoryPayload;
      this.categoryValidator.validatePostPayload(payload);

      const event = await this.service.addNewCategory(payload);

      return res
        .status(201)
        .json(createResponse(constants.SUCCESS_RESPONSE_MESSAGE, event));
    } catch (error) {
      return next(error);
    }
  }
}
