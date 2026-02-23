import { toast } from 'react-hot-toast'

export const showToast = {
  success: (message) => {
    toast.success(message, {
      style: {
        background: '#fff',
        color: '#1f2937',
        padding: '16px',
        borderRadius: '8px',
      },
      iconTheme: {
        primary: '#0CA678',
        secondary: '#fff',
      },
    })
  },
  error: (message) => {
    toast.error(message, {
      style: {
        background: '#fff',
        color: '#1f2937',
        padding: '16px',
        borderRadius: '8px',
      },
      iconTheme: {
        primary: '#ef4444',
        secondary: '#fff',
      },
    })
  },
  info: (message) => {
    toast(message, {
      icon: 'ℹ️',
      style: {
        background: '#fff',
        color: '#1f2937',
        padding: '16px',
        borderRadius: '8px',
      },
    })
  },
  loading: (message) => {
    return toast.loading(message, {
      style: {
        background: '#fff',
        color: '#1f2937',
        padding: '16px',
        borderRadius: '8px',
      },
    })
  },
  dismiss: (toastId) => {
    toast.dismiss(toastId)
  },
}

export default showToast