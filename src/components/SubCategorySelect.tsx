import type { FC } from "react";
import { Form, Spinner } from "react-bootstrap";
import { type Control, Controller } from "react-hook-form";
import type { SubCategory } from "@domain/models";

type FormData = {
  categoryId: string;
  subCategoryId: string;
};

type Props = {
  control: Control<FormData>;
  name: keyof FormData;
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
    <Form.Group controlId="subCategorySelect" className="mb-3">
      <Form.Label>Subcategoría</Form.Label>
      <Controller
        control={control}
        name={name}
        defaultValue=""
        render={({ field }) => (
          <>
            <Form.Select
              {...field}
              aria-label="Seleccionar subcategoría"
              disabled={disabled || loading}
            >
              <option value="">-- Selecciona una subcategoría --</option>
              {subCategories.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Form.Select>
            {loading && (
              <div className="mt-2 d-flex align-items-center">
                <Spinner
                  animation="border"
                  size="sm"
                  role="status"
                  className="me-2"
                />
                <small>Cargando subcategorías...</small>
              </div>
            )}
          </>
        )}
      />
    </Form.Group>
  );
};
