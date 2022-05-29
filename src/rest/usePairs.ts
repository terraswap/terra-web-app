import { useCallback, useEffect, useMemo, useState } from "react"
import { LUNA, ULUNA } from "constants/constants"
import useAPI from "./useAPI"
import { useNetwork } from "hooks"

interface Pairs {
  pairs: Pair[]
}

export interface Pair {
  pair: TokenInfo[]
  contract: string
  liquidity_token: string
}

interface TokenInfo {
  symbol: string
  name: string
  contract_addr: string
  decimals: number
  icon: string
  verified: boolean
}

interface PairsResult {
  pairs: PairResult[]
}

interface PairResult {
  liquidity_token: string
  contract_addr: string
  asset_infos: (NativeInfo | AssetInfo)[]
}

interface TokenResult {
  name: string
  symbol: string
  decimals: number
  total_supply: string
  contract_addr: string
  icon: string
  verified: boolean
}

export let tokenInfos: Map<string, TokenInfo> = new Map<string, TokenInfo>([
  [
    LUNA,
    {
      contract_addr: ULUNA,
      symbol: LUNA,
      name: ULUNA,
      decimals: 6,
      icon: "",
      verified: true,
    },
  ],
])

export let lpTokenInfos: Map<string, TokenInfo[]> = new Map<
  string,
  TokenInfo[]
>()

export let InitLP = ""

const usePairs = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<Pairs>({ pairs: [] })
  const { loadPairs, loadTokenInfo, loadTokens } = useAPI()
  const { name: networkName } = useNetwork()
  const [currentNetworkName, setCurrentNetworkName] = useState("")

  const getTokenInfo = useCallback(
    async (info: NativeInfo | AssetInfo) => {
      let tokenInfo: TokenInfo | undefined
      if (isAssetInfo(info)) {
        tokenInfo = tokenInfos.get(info.token.contract_addr)
        if (!tokenInfo) {
          const tokenResult: TokenResult | undefined = await loadTokenInfo(
            info.token.contract_addr
          )
          tokenInfo = {
            symbol: "",
            name: "",
            contract_addr: info.token.contract_addr,
            decimals: 6,
            icon: "",
            verified: false,
          }
          if (tokenResult) {
            tokenInfo = {
              symbol: tokenResult.symbol,
              name: tokenResult.name,
              contract_addr: info.token.contract_addr,
              decimals: tokenResult.decimals,
              icon: tokenResult.icon,
              verified: tokenResult.verified,
            }
          }
          tokenInfos.set(info.token.contract_addr, tokenInfo)
        }
      } else if (isNativeInfo(info)) {
        tokenInfo = tokenInfos.get(info.native_token.denom)
      }

      return tokenInfo
    },
    [loadTokenInfo]
  )

  useEffect(() => {
    try {
      if (
        isLoading ||
        (result?.pairs.length > 0 && currentNetworkName === networkName)
      ) {
        return
      }
      setIsLoading(true)
      setCurrentNetworkName(networkName)

      const fetchTokensInfo = async () => {
        try {
          const res = await loadTokens()
          res.forEach((tokenInfo: TokenResult) => {
            tokenInfos.set(tokenInfo.contract_addr, tokenInfo)
          })
        } catch (error) {
          console.error(error)
        }
      }

      const fetchPairs = async () => {
        const res: PairsResult = await loadPairs()
        const pairs = await Promise.all(
          res.pairs.map(async (pairResult: PairResult) => {
            try {
              const tokenInfo1 = await getTokenInfo(pairResult.asset_infos[0])
              const tokenInfo2 = await getTokenInfo(pairResult.asset_infos[1])
              if (tokenInfo1 === undefined || tokenInfo2 === undefined) {
                return
              }

              const lpTokenInfo = await getTokenInfo({
                token: { contract_addr: pairResult.liquidity_token },
              })

              lpTokenInfos.set(pairResult.liquidity_token, [
                tokenInfo1,
                tokenInfo2,
              ])

              lpTokenInfo &&
                tokenInfos.set(pairResult.liquidity_token, {
                  contract_addr: pairResult.liquidity_token,
                  name: lpTokenInfo.name,
                  symbol: lpTokenInfo.symbol,
                  decimals: lpTokenInfo.decimals,
                  icon: "",
                  verified: false,
                })

              let pair: Pair = {
                contract: pairResult.contract_addr,
                pair: [tokenInfo1, tokenInfo2],
                liquidity_token: pairResult.liquidity_token,
              }

              return pair
            } catch (error) {
              console.error(error)
            }
            return undefined
          })
        )

        if (pairs) {
          setResult({
            pairs: pairs.filter((pair) => !!pair) as Pair[],
          })
          setIsLoading(false)
        }
      }

      fetchTokensInfo().then(() => fetchPairs())
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  }, [
    currentNetworkName,
    getTokenInfo,
    isLoading,
    loadPairs,
    loadTokens,
    networkName,
    result,
  ])

  return { ...result, isLoading, getTokenInfo }
}

export default usePairs

export const useTokenInfos = () => {
  const { isLoading: isPairsLoading } = usePairs()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const res = useMemo(() => new Map(tokenInfos), [isPairsLoading])
  return res
}

export const useLpTokenInfos = () => {
  const { isLoading: isPairsLoading } = usePairs()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const res = useMemo(() => new Map(lpTokenInfos), [isPairsLoading])
  return res
}

export function isAssetInfo(object: any): object is AssetInfo {
  return "token" in object
}

export function isNativeInfo(object: any): object is NativeInfo {
  return "native_token" in object
}
