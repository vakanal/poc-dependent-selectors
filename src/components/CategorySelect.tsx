import type { FC } from "react";
import { Form } from "react-bootstrap";
import { type Control, Controller } from "react-hook-form";
import type { Category } from "@domain/models";
import type { FormValues } from "@schemas/FormSelectsSchema";
import { LoadingSpinner } from "@components/LoadingSpinner";

type Props = {
  control: Control<FormValues>;
  name: keyof FormValues;
  categories: Category[];
  loading?: boolean;
  disabled?: boolean;
};

export const CategorySelect: FC<Props> = ({
  control,
  name,
  categories,
  loading,
  disabled,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      render={({ field, fieldState }) => (
        <Form.Group controlId="categorySelect" className="mb-3">
          <Form.Label>Categoria</Form.Label>
          <Form.Select
            {...field}
            aria-label="Seleccionar categoría"
            disabled={disabled || loading}
            isInvalid={!!fieldState.error}
          >
            <option value="">-- Selecciona una categoría --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {fieldState.error?.message}
          </Form.Control.Feedback>
          {loading && <LoadingSpinner message="Cargando categorías..." />}
        </Form.Group>
      )}
    />
  );
};
