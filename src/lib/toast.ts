import { toast } from "@/hooks/use-toast"

interface ToastOptions {
  title?: string
  description?: string
  duration?: number
}

export const showToast = {
  success: ({ title = "成功", description, duration = 3000 }: ToastOptions) => {
    toast({
      variant: "success",
      title: `✅ ${title}`,
      description,
      duration,
    })
  },

  error: ({ title = "错误", description, duration = 3000 }: ToastOptions) => {
    toast({
      variant: "destructive",
      title: `❌ ${title}`,
      description,
      duration,
    })
  },

  warning: ({ title = "警告", description, duration = 3000 }: ToastOptions) => {
    toast({
      variant: "warning",
      title: `⚠️ ${title}`,
      description,
      duration,
    })
  },

  info: ({ title = "信息", description, duration = 3000 }: ToastOptions) => {
    toast({
      variant: "info",
      title: `ℹ️ ${title}`,
      description,
      duration,
    })
  },
}
