import type { FC } from "react";
import { Form } from "react-bootstrap";
import { type Control, Controller } from "react-hook-form";
import type { FormValues } from "@schemas/FormSelectsSchema";
import { LoadingSpinner } from "@components/ui/LoadingSpinner";
import type { Category, SubCategory } from "@domain/models";

type Props = {
  label: string;
  groupId: string;
  control: Control<FormValues>;
  name: keyof FormValues;
  options: Category[] | SubCategory[];
  placeholder: string;
  spinnerMessage?: string;
  loading?: boolean;
  disabled?: boolean;
};

export const CustomSelect: FC<Props> = ({
  label,
  groupId,
  control,
  name,
  options,
  placeholder,
  spinnerMessage,
  loading,
  disabled,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      render={({ field, fieldState }) => (
        <Form.Group controlId={groupId} className="mb-3">
          <Form.Label>{label}</Form.Label>
          <Form.Select
            {...field}
            aria-label={label}
            disabled={disabled || loading}
            isInvalid={!!fieldState.error}
          >
            <option value="">{placeholder}</option>
            {options.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {fieldState.error?.message}
          </Form.Control.Feedback>
          {loading && <LoadingSpinner message={spinnerMessage} />}
        </Form.Group>
      )}
    />
  );
};
