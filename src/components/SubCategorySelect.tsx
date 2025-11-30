import type { FC } from "react";
import { Form } from "react-bootstrap";
import { type Control, Controller } from "react-hook-form";
import type { SubCategory } from "@domain/models";
import type { FormValues } from "@schemas/FormSelectsSchema";
import { LoadingSpinner } from "@components/LoadingSpinner";

type Props = {
  control: Control<FormValues>;
  name: keyof FormValues;
  subCategories: SubCategory[];
  loading?: boolean;
  disabled?: boolean;
};

export const SubCategorySelect: FC<Props> = ({
  control,
  name,
  subCategories,
  loading,
  disabled,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      render={({ field, fieldState }) => (
        <Form.Group controlId="subCategorySelect" className="mb-3">
          <Form.Label>Subcategoría</Form.Label>
          <Form.Select
            {...field}
            aria-label="Seleccionar subcategoría"
            disabled={disabled || loading}
            isInvalid={!!fieldState.error}
          >
            <option value="">-- Selecciona una subcategoría --</option>
            {subCategories.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {fieldState.error?.message}
          </Form.Control.Feedback>
          {loading && <LoadingSpinner message="Cargando subcategorías..." />}
        </Form.Group>
      )}
    />
  );
};
