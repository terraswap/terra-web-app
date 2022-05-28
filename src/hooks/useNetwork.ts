import { useWallet } from "@terra-money/wallet-provider"
import { FINDER } from "constants/constants"
import terraswapNetworks from "constants/networks"

const useNetwork = () => {
  const { network } = useWallet()
  const getFinderUrl = (address: string, path: string = "account") =>
    `${FINDER}/${network.chainID}/${path}/${address}`

  return {
    ...network,
    ...terraswapNetworks[network.name],
    getFinderUrl,
    fcd: network.lcd?.replace("lcd", "lcd"),
  }
}

export default useNetwork
