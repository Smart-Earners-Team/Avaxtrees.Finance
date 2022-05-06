import React from "react";
import ttebLogo from "../../images/tteb-logo.png";
import Section from "./Section";

interface FooterProps extends React.ComponentProps<"footer"> {}

export default function Footer(_props: FooterProps) {
  return (
    <Section
      containerClass="my-10 px-2"
      className="bg-white rounded-full border-gray-300 border shadow-md"
    >
      <footer
        className="text-center px-2 py-3 flex flex-col space-y-2 sm:flex-row sm:space-y-0 justify-between
          items-center font-medium text-base "
      >
        <div className="inline-flex items-center">
          <span>Audited by</span>
          <a href="https://tteb.finance/" className="inline-block mx-2">
            <img src={ttebLogo} alt="TTEB Logo" width={70} height={40} />
          </a>
        </div>
        <div>&copy; Avaxtrees.Finance - {new Date().getFullYear()}</div>
      </footer>
    </Section>
  );
}
