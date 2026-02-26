import { useEffect } from 'react'
import { usePage } from '@inertiajs/react'
import { useNotify } from '@/hooks/use-notify'

export function FlashNotifier() {
  const { flash } = usePage().props as { flash?: Record<string, string | undefined> }
  const notify = useNotify()

  useEffect(() => {
    if (!flash) return
    if (flash.success) notify.success(flash.success)
    if (flash.error) notify.error(flash.error)
    if (flash.info) notify.info(flash.info)
  }, [flash])

  return null
}
