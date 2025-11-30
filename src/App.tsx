import type { FC } from "react";
import { MainLayout } from "@layouts/MainLayout";
import { FormSelects } from "@components/FormSelects";

export const App: FC = () => {
  return (
    <MainLayout>
      <FormSelects />
    </MainLayout>
  );
};
