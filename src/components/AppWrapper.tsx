import React from "react";
import { Web3ReactProvider } from "@web3-react/core";
import { IconContext } from "react-icons";
import { ToastsProvider, ToastListener } from "../contexts/ToastContext";
import { getLibrary } from "../utils/web3React";
import ModalProvider from "./Modal/ModalContext";
import AppWalletProvider from "../contexts/AppContext";
import { RefreshContextProvider } from "../contexts/RefreshContext";
import Navbar from "./layouts/Navbar";

/**
 * This component is used to share state accross all sections of the site without unmounting on page
 * navigation.
 */
export default function AppWrapper(props: { children: React.ReactNode }) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ToastsProvider>
        <ToastListener />
        <ModalProvider>
          <IconContext.Provider value={{ className: "w-6 h-6" }}>
            <RefreshContextProvider>
              <AppWalletProvider>
                <Navbar />
                {props.children}
              </AppWalletProvider>
            </RefreshContextProvider>
          </IconContext.Provider>
        </ModalProvider>
      </ToastsProvider>
    </Web3ReactProvider>
  );
}
