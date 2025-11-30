import type { FC } from "react";
import { Spinner } from "react-bootstrap";

type Props = {
  message?: string;
};

export const LoadingSpinner: FC<Props> = ({ message }) => {
  return (
    <div className="mt-2 d-flex align-items-center">
      <Spinner animation="border" size="sm" role="status" className="me-2" />
      {message && <small>{message}</small>}
    </div>
  );
};
