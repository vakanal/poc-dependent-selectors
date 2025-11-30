import type { FC, ReactNode } from "react";
import { Button } from "react-bootstrap";

type Props = {
  disabled?: boolean;
  children?: ReactNode;
};

export const SubmitButton: FC<Props> = ({ disabled, children }) => {
  return (
    <Button type="submit" variant="primary" disabled={disabled}>
      {children ?? "Enviar"}
    </Button>
  );
};
