import Swal from "sweetalert2";

export const alerts = {
  success: (title: string, text?: string) => {
    return Swal.fire({
      icon: "success",
      title,
      text,
      showConfirmButton: true,
      confirmButtonColor: "#10b981"
    });
  },

  successWithTimer: (title: string, text?: string, timer?: number) => {
    return Swal.fire({
      icon: "success",
      title,
      text,
      timer: timer || 3000,
      showConfirmButton: true,
      timerProgressBar: true,
      confirmButtonColor: "#10b981"
    });
  },

  // Success con toast
  successToast: (title: string, text?: string, timer?: number) => {
    return Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title,
      text,
      showConfirmButton: false,
      timer: timer || 3000
    });
  },

  error: (title: string, text: string) => {
    return Swal.fire({
      icon: "error",
      title,
      text,
      confirmButtonColor: "#ef4444",
    });
  },

  confirm: (title: string, text: string) => {
    return Swal.fire({
      icon: "warning",
      title,
      text,
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar",
    });
  },
};
