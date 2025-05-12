
import * as React from "react"
import type { ToastActionElement, ToastProps } from "@/components/ui/toast"

export type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

export interface ToastState {
  toasts: ToasterToast[]
}

export const TOAST_LIMIT = 5
export const TOAST_REMOVE_DELAY = 1000000
