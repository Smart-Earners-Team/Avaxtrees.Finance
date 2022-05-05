import React from "react";
import type { ButtonProps } from "../../types";
import cls from "classnames";
import { RiLoaderLine } from "react-icons/ri";

export default function Button({
  className,
  label,
  children,
  loading,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cls(
        "rounded-md px-4 py-2 bg-[#FEF975] text-[#294B0F] hover:bg-[#f1eb34] ring-[#3C641D]",
        "ring-2 disabled:cursor-not-allowed disabled:opacity-60 text-center border-none outline-none",
        "font-medium",
        className
      )}
      {...props}
      title={label}
    >
      {children}
      {loading && (
        <RiLoaderLine className="animate-spin inline-block h-5 w-5 ml-1" />
      )}
    </button>
  );
}
