
import * as React from "react"
import { ToastState } from "@/types/toast"
import { toast } from "./toast-methods"
import { memoryState, listeners } from "./toast-reducer"

export function useToast() {
  const [state, setState] = React.useState<ToastState>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => toast.dismiss(toastId),
  }
}

export { toast }
