import { parseUnits } from "ethers/lib/utils";

export enum ChainId {
  MAINNET = 43114,
  TESTNET = 97,
}

export const BASE_BSC_SCAN_URLS = {
  [ChainId.MAINNET]: "https://snowtrace.io",
  [ChainId.TESTNET]: "https://testnet.bscscan.com",
};

export const BASE_BSC_SCAN_URL = BASE_BSC_SCAN_URLS[ChainId.MAINNET];

export const addresses = {
  riceContract: {
    43114: "0x446BFC36541cC6b4832408Cc7E75A4e2D17CDC15",
    97: "0x48fb25ae9b51704173dcf71e03e6f3896dc20abe",
  },
};

export const networkList = {
  1: {
    url: "https://etherscan.io/",
    name: "Ethereum Mainnet",
  },
  2: {
    url: "https://mordenexplorer.ethernode.io/",
    name: "Morden",
  },
  3: {
    url: "https://ropsten.etherscan.io/",
    name: "Ropsten",
  },
  4: {
    url: "https://rinkeby.etherscan.io/",
    name: "Rinkeby",
  },
  42: {
    url: "https://kovan.etherscan.io/",
    name: "Kovan",
  },
  56: {
    url: "https://bsc-dataseed.binance.org/",
    name: "Binance Smart Chain",
  },
  97: {
    url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    name: "Binance Smart Chain - Testnet",
  },
  43114: {
    url: "https://api.avax.network/ext/bc/C/rpc",
    name: "Avalanche",
  },
};

export enum GAS_PRICE {
  default = "5",
  fast = "6",
  instant = "7",
  testnet = "10",
}

export const GAS_PRICE_GWEI = {
  default: parseUnits(GAS_PRICE.default, "gwei").toString(),
  fast: parseUnits(GAS_PRICE.fast, "gwei").toString(),
  instant: parseUnits(GAS_PRICE.instant, "gwei").toString(),
  testnet: parseUnits(GAS_PRICE.testnet, "gwei").toString(),
};
