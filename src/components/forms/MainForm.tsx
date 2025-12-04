import { type FC } from "react";
import { DependentForm } from "./DependentForm";
import type { FormValues } from "@schemas/FormSelectsSchema";

export const MainForm: FC = () => {
  const onSubmit = (data: FormValues) => {
    alert(
      `Enviado:\nCategoría: ${data.categoryId}\nSubcategoría: ${data.subCategoryId}`
    );
  };

  return <DependentForm onSubmit={onSubmit} />;
};
