import { type FC, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FormValues, formSchema } from "@schemas/FormSelectsSchema";
import { DependentFormContext } from "./DependentFormContext";

interface DependentFormProviderProps {
  children: ReactNode;
  onSubmit: (data: FormValues) => void;
}

export const DependentFormProvider: FC<DependentFormProviderProps> = ({ children, onSubmit }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { categoryId: "", subCategoryId: "" },
    mode: "onChange",
  });

  return (
    <DependentFormContext.Provider value={{ form, onSubmit }}>
      {children}
    </DependentFormContext.Provider>
  );
};