import { ethers } from "ethers";
import { getTreeContractAddress } from "./addressHelpers";
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

export const getTreeContract = (signer?: CallSignerType) => {
  return getContract(avaxTreeContractAbi, getTreeContractAddress(), signer);
};
