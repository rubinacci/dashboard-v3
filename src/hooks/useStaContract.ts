// import { JSBI, Token, TokenAmount } from "@uniswap/sdk";
import { useWeb3Result } from "./useWeb3Result";

import ERC20 from "./abi/ERC20.json";
import { Contract } from "ethers";

export const useStaContract = (address: string) => {
  return useWeb3Result(async ({ account, chainId, library }) => {
    const signer = library.getSigner(account).connectUnchecked();
    const contract = new Contract(address, ERC20 as any, signer);
    return contract;
  });
};
