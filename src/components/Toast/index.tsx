import { ToastContainer, toast, ToastOptions } from 'react-toastify';

const options: ToastOptions = {
  autoClose: 5000,
  position: "top-right",
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
}

export function showInfoMessage(message: string) {
  toast.info(message, options)
}

export function showSuccessMessage(message: string) {
  toast.success(message, options)
}

export function showWarningMessage(message: string) {
  toast.warn(message, options)
}

export function showErrorMessage(message: string) {
  toast.error(message, options)
}

export const ToastComponent = () => (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
)
