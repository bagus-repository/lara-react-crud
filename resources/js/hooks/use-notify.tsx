import { toast } from "sonner"

/**
 * useNotify - unified toast notification system
 * Example:
 *   notify.success("Data saved successfully")
 *   notify.error("Failed to submit form")
 */
export function useNotify() {
  return {
    success: (message: string, description?: string) =>
      toast.success(message, {
        description,
      }),

    error: (message: string, description?: string) =>
      toast.error(message, {
        description,
      }),

    info: (message: string, description?: string) =>
      toast.info(message, {
        description,
      }),

    warning: (message: string, description?: string) =>
      toast.warning(message, {
        description,
      }),

    custom: (title: string, description?: string, action?: { label: string; onClick: () => void }) =>
      toast(title, {
        description,
        action,
      }),
  }
}
