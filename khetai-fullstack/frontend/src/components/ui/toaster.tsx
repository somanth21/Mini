import { useToast } from "@/hooks/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map(function ({ id, title, description, action, variant, open, onOpenChange, ...props }) {
        return (
          <div
            key={id}
            {...props}
            className={`pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all duration-300 ${
              open === false ? "opacity-0 translate-y-4 scale-95" : "opacity-100 translate-y-0 scale-100"
            } ${
              variant === "destructive"
                ? "destructive group border-red-500 bg-red-600 text-slate-50"
                : "border bg-white text-slate-950"
            } mt-4 mb-2 first:mt-0`}
          >
            <div className="grid gap-1">
              {title && <div className="text-sm font-semibold">{title}</div>}
              {description && <div className="text-sm opacity-90">{description}</div>}
            </div>
            {action}
          </div>
        )
      })}
    </div>
  )
}
