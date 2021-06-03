import { ToastContainer, toast, ToastOptions } from 'react-toastify'

const options: ToastOptions = {
  autoClose: 5000,
  position: "top-right",
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
}

function showInfoMessage(message: string) {
  toast.info(message, options)
}

function showSuccessMessage(message: string) {
  toast.success(message, options)
}

function showWarningMessage(message: string) {
  toast.warn(message, options)
}

function showErrorMessage(message: string) {
  toast.error(message, options)
}

function ToastComponent() {
  return (
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
}

export {
  showInfoMessage,
  showSuccessMessage,
  showWarningMessage,
  showErrorMessage,
  ToastComponent
}
