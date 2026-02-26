import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import React, { createContext, useContext, useState, ReactNode } from "react"

interface DialogOptions {
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: "confirm" | "alert"
  destructive?: boolean
}

interface ConfirmContextValue {
  confirm: (options: DialogOptions) => Promise<boolean>
  alert: (options: Omit<DialogOptions, "variant">) => Promise<void>
}

const ConfirmContext = createContext<ConfirmContextValue | undefined>(undefined)

export function useConfirm() {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error("useConfirm must be used within GlobalConfirmProvider")
  return ctx.confirm
}

export function useAlert() {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error("useAlert must be used within GlobalConfirmProvider")
  return ctx.alert
}

export function GlobalConfirmProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<DialogOptions>({})
  const [resolver, setResolver] = useState<(value: boolean | void) => void>(() => () => {})

  const confirm = (opts: DialogOptions): Promise<boolean> => {
    setOptions({ variant: "confirm", ...opts })
    setIsOpen(true)
    return new Promise((resolve) => setResolver(() => resolve))
  }

  const alert = (opts: Omit<DialogOptions, "variant">): Promise<void> => {
    setOptions({ variant: "alert", ...opts })
    setIsOpen(true)
    return new Promise((resolve) => setResolver(() => resolve))
  }

  const handleConfirm = () => {
    resolver(true)
    setIsOpen(false)
  }

  const handleCancel = () => {
    resolver(false)
    setIsOpen(false)
  }

  const handleCloseAlert = () => {
    resolver()
    setIsOpen(false)
  }

  return (
    <ConfirmContext.Provider value={{ confirm, alert }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{options.title ?? "Notification"}</DialogTitle>
            {options.description && (
              <DialogDescription>{options.description}</DialogDescription>
            )}
          </DialogHeader>

          {options.variant === "confirm" ? (
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancel}>
                {options.cancelText ?? "Cancel"}
              </Button>
              <Button
                variant={options.destructive ? "destructive" : "default"}
                onClick={handleConfirm}
              >
                {options.confirmText ?? "Confirm"}
              </Button>
            </DialogFooter>
          ) : (
            <DialogFooter className="flex justify-end">
              <Button onClick={handleCloseAlert}>OK</Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </ConfirmContext.Provider>
  )
}
