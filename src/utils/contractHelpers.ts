import { ethers } from "ethers";
import { getRiceContractAddress } from "./addressHelpers";
import avaxTreeContractAbi from "../config/abi/avaxTreeContract.json";
import { simpleRpcProvider } from "./providers";
import { CallSignerType } from "../types";

export const getContract = (
  abi: any,
  address: string,
  signer?: CallSignerType | undefined
) => {
  const signerOrProvider = signer ?? simpleRpcProvider;
  return new ethers.Contract(address, abi, signerOrProvider);
};

export const getRiceContract = (signer?: CallSignerType) => {
  return getContract(avaxTreeContractAbi, getRiceContractAddress(), signer);
};
