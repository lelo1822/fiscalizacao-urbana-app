
import { ToasterToast } from "@/types/toast"
import { dispatch } from "./toast-reducer"

// Counter for generating unique IDs
let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

type Toast = Omit<ToasterToast, "id">

export function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

toast.dismiss = (toastId?: string) => {
  dispatch({ type: "DISMISS_TOAST", toastId })
}

toast.success = (title: string, options?: Omit<ToasterToast, "id">) => {
  return toast({ title, ...options, variant: "default" })
}

toast.error = (title: string, options?: Omit<ToasterToast, "id">) => {
  return toast({ title, ...options, variant: "destructive" })
}

toast.warning = (title: string, options?: Omit<ToasterToast, "id">) => {
  return toast({ title, ...options, variant: "default" })
}

toast.info = (title: string, options?: Omit<ToasterToast, "id">) => {
  return toast({ title, ...options, variant: "default" })
}
