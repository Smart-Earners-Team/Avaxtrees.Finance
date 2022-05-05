import BigNumber from "bignumber.js";
import type { CallSignerType } from "../../types";
import { getTreeContract } from "../contractHelpers";
import { isAddress } from "ethers/lib/utils";
import { BIG_TEN } from "../bigNumber";

export const rePlantTrees = async (ref: string, signer: CallSignerType) => {
  if (isAddress(ref)) {
    const contract = getTreeContract(signer);
    const tx = await contract.rePlantTrees(ref);
    const receipt = await tx.wait();
    return receipt.status;
  } else {
    throw new Error("You have entered an invalid referral address");
  }
};

export const harvestCrops = async (signer: CallSignerType) => {
  const contract = getTreeContract(signer);
  const tx = await contract.harvestCrops();
  const receipt = await tx.wait();
  return receipt.status;
};

export const plantTrees = async (
  amount: string,
  ref: string,
  signer: CallSignerType
) => {
  if (isAddress(ref)) {
    const value = new BigNumber(amount).times(BIG_TEN.pow(18)).toJSON();
    const contract = getTreeContract(signer);
    const tx = await contract.plantTrees(ref, { value });
    const receipt = await tx.wait();
    return receipt.status;
  } else {
    throw new Error("You have entered an invalid referral address");
  }
};
