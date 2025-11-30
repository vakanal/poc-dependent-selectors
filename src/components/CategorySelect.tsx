import type { FC } from "react";
import { Form } from "react-bootstrap";
import { type Control, Controller } from "react-hook-form";
import type { Category } from "@domain/models";

type FormData = {
  categoryId: string;
  subCategoryId: string;
};

type Props = {
  control: Control<FormData>;
  name: keyof FormData;
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
    <Form.Group controlId="categorySelect" className="mb-3">
      <Form.Label>Categoria</Form.Label>
      <Controller
        control={control}
        name={name}
        defaultValue=""
        render={({ field }) => (
          <Form.Select
            {...field}
            aria-label="Seleccionar categoría"
            disabled={disabled || loading}
          >
            <option value="">-- Selecciona una categoría --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Form.Select>
        )}
      />
    </Form.Group>
  );
};
