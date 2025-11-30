export type Category = {
  id: string;
  name: string;
};

export type SubCategory = {
  id: string;
  categoryId: string;
  name: string;
};
