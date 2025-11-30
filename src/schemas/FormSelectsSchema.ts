import { z } from "zod";

export const formSchema = z.object({
  categoryId: z.string().min(1, "Selecciona una categoría"),
  subCategoryId: z.string().min(1, "Selecciona una subcategoría"),
});

export type FormValues = z.infer<typeof formSchema>;
