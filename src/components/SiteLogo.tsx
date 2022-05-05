import React from "react";
import { StaticImage } from "gatsby-plugin-image";
import Link from "./Link";

export default function SiteLogo(props: { text: string }) {
  return (
    <Link
      to="/"
      className="inline-flex items-center shrink-0 font-bold text-lg space-x-2"
    >
      <StaticImage
        src="../images/icon.png"
        alt={props.text + " Logo"}
        width={50}
        height={50}
        placeholder="blurred"
      />
      <span>{props.text}</span>
    </Link>
  );
}
