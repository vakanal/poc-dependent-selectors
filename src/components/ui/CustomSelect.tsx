import { Form } from "react-bootstrap";
import { type Control, Controller } from "react-hook-form";
import type { FormValues } from "@schemas/FormSelectsSchema";
import { LoadingSpinner } from "@components/ui/LoadingSpinner";

type BaseOption = {
  id: string;
  name: string;
};

type Props<T extends BaseOption> = {
  label: string;
  groupId: string;
  control: Control<FormValues>;
  name: keyof FormValues;
  options: T[];
  placeholder: string;
  spinnerMessage?: string;
  loading?: boolean;
  disabled?: boolean;
};

export const CustomSelect = <T extends BaseOption>({
  label,
  groupId,
  control,
  name,
  options,
  placeholder,
  spinnerMessage,
  loading,
  disabled,
}: Props<T>) => {
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

            {options.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
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
