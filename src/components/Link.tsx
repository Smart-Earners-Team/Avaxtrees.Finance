import React from "react";
import { Link as GatsbyLink } from "gatsby";
import cls from "classnames";

type LinkProps = {
  as?: "button";
  variant?: "primary";
};
export default function Link({
  children,
  to,
  activeClassName,
  partiallyActive,
  className,
  state,
  as,
  variant = "primary",
  ...other
}: React.ComponentPropsWithoutRef<typeof GatsbyLink> & LinkProps) {
  const internal = /^\/(?!\/)/.test(to);
  let linkClassName = as === "button" ? "btn" : "";
  if (as === "button" && variant === "primary") {
    linkClassName += " btn-primary md:hover:text-gray-50";
  }

  // Use Gatsby Link for internal links, and <a> for others
  if (internal) {
    return (
      <GatsbyLink
        to={to}
        className={cls("hover:text-[#c5ff3c]", linkClassName, className)}
        activeClassName={activeClassName}
        partiallyActive={partiallyActive}
        {...other}
      >
        {children}
      </GatsbyLink>
    );
  }
  return (
    <a
      href={to}
      rel="nofollow noreferrer noopener"
      target="_blank"
      className={cls("hover:text-[#c5ff3c]", linkClassName, className)}
      {...other}
    >
      {children}
    </a>
  );
}
