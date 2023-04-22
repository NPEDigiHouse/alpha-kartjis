import { Category } from "@prisma/client";

interface IListCategoryDTO {
  id: string;
  name: string;
}

export const ListCategoryMapper = (data: Category) => {
  return {
    id: data.id,
    name: data.name,
  } as IListCategoryDTO;
};
