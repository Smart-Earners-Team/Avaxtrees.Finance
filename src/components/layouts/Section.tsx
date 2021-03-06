import React from "react";
import cls from "classnames";

export default function Section({
  noPadding = true,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  containerClass?: string;
  noPadding?: boolean;
}) {
  const pClass = noPadding ? "pt-0 py-0" : "py-20";
  return (
    <div className={cls(props.containerClass)}>
      <div
        className={cls(
          "px-2 md:px-8 max-w-screen-lg mx-auto",
          pClass,
          props.className
        )}
      >
        {props.children}
      </div>
    </div>
  );
}
