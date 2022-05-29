export enum NetworkKey {
  MAINNET = "mainnet",
  TESTNET = "testnet",
}

interface TerraswapNetwork {
  factory: string
  service: string
  dashboard: string | undefined
  router: string
  fee: {
    gasPrice: string
    amount: string
    gas: string
  }
  stats: string
}

export const AVAILABLE_CHAIN_ID_LIST = ["phoenix-1", "pisco-1"]

const terraswapNetworks: Record<string, TerraswapNetwork> = {
  mainnet: {
    factory: "terra1466nf3zuxpya8q9emxukd7vftaf6h4psr0a07srl5zw74zh84yjqxl5qul",
    service:
      process.env.REACT_APP_MAINNET_SERVICE_URL || "https://api.terraswap.io/",
    dashboard: process.env.REACT_APP_MAINNET_DASHBOARD_URL,
    router: "terra13ehuhysn5mqjeaheeuew2gjs785f6k7jm8vfsqg3jhtpkwppcmzqcu7chk",
    fee: { gasPrice: "0.15", amount: "1518", gas: "2000000" },
    stats: "https://fcd.terra.dev/",
  },
  testnet: {
    factory: "terra1jha5avc92uerwp9qzx3flvwnyxs3zax2rrm6jkcedy2qvzwd2k7qk7yxcl",
    service:
      process.env.REACT_APP_TESTNET_SERVICE_URL ||
      "https://api-pisco.terraswap.io/",
    dashboard: process.env.REACT_APP_TESTNET_DASHBOARD_URL,
    router: "terra1xp6xe6uwqrspumrkazdg90876ns4h78yw03vfxghhcy03yexcrcsdaqvc8",
    fee: { gasPrice: "0.15", amount: "1518", gas: "2000000" },
    stats: "https://pisco-fcd.terra.dev/",
  },
}

export default terraswapNetworks
