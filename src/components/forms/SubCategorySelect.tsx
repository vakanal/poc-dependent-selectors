import { type FC, useMemo } from "react";
import { Form } from "react-bootstrap";
import { useWatch } from "react-hook-form";
import { useDependentForm } from "./DependentFormContext";
import { useSubCategories } from "@hooks/useSubCategories";
import { CustomSelect } from "@components/ui/CustomSelect";
import type { SubCategory } from "@domain/models";

export const SubCategorySelect: FC = () => {
  const { form } = useDependentForm();
  const { control } = form;
  
  const selectedCategoryId = useWatch({
    control,
    name: "categoryId",
    defaultValue: "",
  });

  const {
    subCategories,
    loading: loadingSubCategories,
    error: errorSubCategories,
  } = useSubCategories(selectedCategoryId);

  const isDisabled = useMemo(() => !selectedCategoryId, [selectedCategoryId]);

  return (
    <>
      {errorSubCategories && (
        <Form.Text className="text-danger mb-2">
          Error cargando subcategorías: {errorSubCategories}
        </Form.Text>
      )}
      
      <CustomSelect<SubCategory>
        label="Subcategoría"
        groupId="sub-category-select"
        control={control}
        name="subCategoryId"
        options={subCategories || []}
        placeholder="-- Selecciona una subcategoría --"
        spinnerMessage="Cargando subcategorías..."
        loading={loadingSubCategories}
        disabled={isDisabled}
      />
    </>
  );
};