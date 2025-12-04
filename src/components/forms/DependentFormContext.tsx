import { createContext, useContext } from "react";
import { type UseFormReturn } from "react-hook-form";
import { type FormValues } from "@schemas/FormSelectsSchema";

interface DependentFormContextType {
  form: UseFormReturn<FormValues>;
  onSubmit: (data: FormValues) => void;
}

export const DependentFormContext = createContext<DependentFormContextType | null>(null);

export const useDependentForm = () => {
  const context = useContext(DependentFormContext);
  if (!context) {
    throw new Error("useDependentForm must be used within DependentFormProvider");
  }
  return context;
};