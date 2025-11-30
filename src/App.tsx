import type { FC } from "react";
import { MainLayout } from "@layouts/MainLayout";
import { MainForm } from "@components/forms/MainForm";

export const App: FC = () => {
  return (
    <MainLayout>
      <MainForm />
    </MainLayout>
  );
};
