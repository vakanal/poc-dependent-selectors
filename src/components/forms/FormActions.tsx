import { type FC } from "react";
import { useDependentForm } from "./DependentFormContext";
import { SubmitButton } from "@components/ui/SubmitButton";

export const FormActions: FC = () => {
  const { form } = useDependentForm();
  const { formState, reset } = form;

  const onReset = () => {
    reset();
  };

  return (
    <div className="d-flex gap-2">
      <SubmitButton disabled={formState.isSubmitting}>
        Enviar
      </SubmitButton>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={onReset}
      >
        Reset
      </button>
    </div>
  );
};