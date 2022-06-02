import { useNetwork } from "hooks"

export default (symbol: string) => {
  const network = useNetwork()

  return { gasPrice: network.fee?.gasPrice }
}
