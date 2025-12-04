import type { FC } from "react";
import { MainLayout } from "@layouts/MainLayout";
import { MainForm } from "@components/forms/MainForm";
import { ErrorBoundary } from "@components/ui/ErrorBoundary";

export const App: FC = () => {
  return (
    <MainLayout>
      <ErrorBoundary>
        <MainForm />
      </ErrorBoundary>
    </MainLayout>
  );
};
