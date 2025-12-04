// Commands - Intentions to change state
import type { ICommand } from './index';

export interface SelectCategoryCommand extends ICommand {
  type: 'SelectCategory';
  categoryId: string;
}

export interface UnselectCategoryCommand extends ICommand {
  type: 'UnselectCategory';
  categoryId: string;
}

export interface SelectSubCategoryCommand extends ICommand {
  type: 'SelectSubCategory';
  categoryId: string;
  subCategoryId: string;
}

// Queries - Intentions to read state
import type { IQuery } from './index';

export interface GetCategoriesQuery extends IQuery {
  type: 'GetCategories';
}

export interface GetSubCategoriesQuery extends IQuery {
  type: 'GetSubCategories';
  categoryId: string;
}

export interface GetSelectedCategoryQuery extends IQuery {
  type: 'GetSelectedCategory';
}