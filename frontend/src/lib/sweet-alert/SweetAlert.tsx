"use client";

import Swal from "sweetalert2";
import type { ConfirmAlertOptions } from "./types";

export const showConfirm = async (options: ConfirmAlertOptions) => {
  const result = await Swal.fire({
    title: options.title || "Are you sure?",
    text: options.text || "This action cannot be undone.",
    icon: options.icon || "warning",
    showCancelButton: true,
    confirmButtonText: options.confirmButtonText || "Yes",
    cancelButtonText: options.cancelButtonText || "Cancel",
  });

  return result.isConfirmed;
};

export const showSuccess = (message: string) => {
  return Swal.fire({
    title: "Success",
    text: message,
    icon: "success",
    timer: 2000,
    showConfirmButton: false,
  });
};

export const showError = (message: string) => {
  return Swal.fire({
    title: "Error",
    text: message,
    icon: "error",
    timer: 2000,
    showConfirmButton: false,
  });
};


export const showAlert = (options: {
  type?: "success" | "error" | "info" | "warning";
  title?: string;
  message?: string;
  timer?: number;
}) => {
  return Swal.fire({
    title: options.title || "Alert",
    text: options.message || "",
    icon: options.type || "info",
    timer: options.timer || 2000,
    showConfirmButton: false,
  });
};