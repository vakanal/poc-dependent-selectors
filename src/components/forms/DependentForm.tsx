import { type FC, useEffect } from "react";
import { Form } from "react-bootstrap";
import { DependentFormProvider } from "./DependentFormProvider";
import { useDependentForm } from "./DependentFormContext";
import { CategorySelect } from "./CategorySelect";
import { SubCategorySelect } from "./SubCategorySelect";
import { FormActions } from "./FormActions";
import type { FormValues } from "@schemas/FormSelectsSchema";

interface DependentFormProps {
  onSubmit: (data: FormValues) => void;
}

export const DependentForm: FC<DependentFormProps> = ({ onSubmit }) => {
  return (
    <DependentFormProvider onSubmit={onSubmit}>
      <DependentFormContent />
    </DependentFormProvider>
  );
};

const DependentFormContent: FC = () => {
  const { form, onSubmit } = useDependentForm();
  const { handleSubmit, reset, watch } = form;

  const selectedCategoryId = watch("categoryId");

  useEffect(() => {
    if (!selectedCategoryId) {
      reset({ categoryId: "", subCategoryId: "" }, { keepValues: false });
    } else {
      reset({
        categoryId: selectedCategoryId,
        subCategoryId: "",
      });
    }
  }, [selectedCategoryId, reset]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <CategorySelect />
      <SubCategorySelect />
      <FormActions />
    </Form>
  );
};