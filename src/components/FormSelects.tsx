import { type FC, useEffect, useMemo } from "react";
import { Form, Alert } from "react-bootstrap";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCategories } from "@hooks/useCategories";
import { useSubCategories } from "@hooks/useSubCategories";
import { type FormValues, formSchema } from "@schemas/FormSelectsSchema";
import { CategorySelect } from "@components/CategorySelect";
import { SubCategorySelect } from "@components/SubCategorySelect";
import { SubmitButton } from "@components/SubmitButton";

export const FormSelects: FC = () => {
  const {
    categories,
    loading: loadingCategories,
    error: errorCategories,
  } = useCategories();

  const { control, handleSubmit, formState, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { categoryId: "", subCategoryId: "" },
    mode: "onChange",
  });

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

  // Si cambias de categoría, limpiar subCategoryId (DRY/KISS: lo gestionamos con useMemo + efecto implícito).
  // Aquí usamos reset parcialmente para mantener SOLID (no acoplar internals)
  useEffect(() => {
    // cuando cambia la categoría, limpiar selección de subcategoría
    if (!selectedCategoryId) {
      reset({ categoryId: "", subCategoryId: "" }, { keepValues: false });
    } else {
      // sólo limpiar subCategoryId manteniendo categoryId
      reset({
        categoryId: selectedCategoryId,
        subCategoryId: "",
      });
    }
  }, [selectedCategoryId, reset]);

  const onSubmit = (data: FormValues) => {
    // Aquí podría ir el caso de uso para enviar datos a un servicio.
    alert(
      `Enviado:\nCategoría: ${data.categoryId}\nSubcategoría: ${data.subCategoryId}`
    );
  };

  // Mejor UX: determinar si deshabilitar select de subcategorías
  const isSubDisabled = useMemo(
    () => !selectedCategoryId,
    [selectedCategoryId]
  );

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {errorCategories && (
          <Alert variant="danger">
            Error cargando categorías: {errorCategories}
          </Alert>
        )}
        {errorSubCategories && (
          <Alert variant="danger">
            Error cargando subcategorías: {errorSubCategories}
          </Alert>
        )}

        <CategorySelect
          control={control}
          name="categoryId"
          categories={categories}
          loading={loadingCategories}
        />

        <SubCategorySelect
          control={control}
          name="subCategoryId"
          subCategories={subCategories}
          loading={loadingSubCategories}
          disabled={isSubDisabled}
        />

        <div className="d-flex gap-2">
          <SubmitButton disabled={formState.isSubmitting}>Enviar</SubmitButton>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => reset()}
          >
            Reset
          </button>
        </div>
      </Form>
    </>
  );
};
