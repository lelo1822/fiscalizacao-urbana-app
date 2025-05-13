
import { useToast as useToastHook } from "./toast/use-toast-hook";
import { toast as toastMethod } from "./toast/toast-methods";

export const useToast = useToastHook;
export const toast = toastMethod;

// For convenience, add method variants
toast.error = (message: string) => {
  toastMethod({
    title: "Erro",
    description: message,
    variant: "destructive"
  });
};

toast.success = (message: string) => {
  toastMethod({
    title: "Sucesso",
    description: message,
    variant: "default"
  });
};

toast.warning = (message: string) => {
  toastMethod({
    title: "Atenção",
    description: message,
    variant: "warning"
  });
};

toast.info = (message: string) => {
  toastMethod({
    title: "Informação",
    description: message,
  });
};
