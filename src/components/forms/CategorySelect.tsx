import { type FC } from "react";
import { Form } from "react-bootstrap";
import { useDependentForm } from "./DependentFormContext";
import { useCategories } from "@hooks/useCategories";
import { CustomSelect } from "@components/ui/CustomSelect";
import type { Category } from "@domain/models";

export const CategorySelect: FC = () => {
  const { form } = useDependentForm();
  const { control } = form;
  
  const {
    categories,
    loading: loadingCategories,
    error: errorCategories,
  } = useCategories();

  return (
    <>
      {errorCategories && (
        <Form.Text className="text-danger mb-2">
          Error cargando categorías: {errorCategories}
        </Form.Text>
      )}
      
      <CustomSelect<Category>
        label="Categoría"
        groupId="category-select"
        control={control}
        name="categoryId"
        options={categories || []}
        placeholder="-- Selecciona una categoría --"
        spinnerMessage="Cargando categorías..."
        loading={loadingCategories}
      />
    </>
  );
};