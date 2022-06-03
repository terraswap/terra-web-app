import { FC, useEffect, useMemo, useRef, useState } from "react"
import classNames from "classnames/bind"
import SwapToken from "./SwapToken"
import styles from "./SwapTokens.module.scss"
import usePairs, { lpTokenInfos } from "../rest/usePairs"
import { Type } from "../pages/Swap"
import { tokenInfos } from "../rest/usePairs"
import Loading from "components/Loading"
import { SwapTokenAsset } from "./useSwapSelectToken"
import { VariableSizeList, ListChildComponentProps } from "react-window"
import { isNativeToken } from "libs/utils"
import styled from "styled-components"

const cx = classNames.bind(styles)

interface Props {
  isFrom: boolean
  selected?: string
  onSelect: (asset: string, isUnable?: boolean) => void
  type: string
  assetList?: SwapTokenAsset[]
  value: string
  formatTokenName?: (symbol: string) => string
}

const NoPairs = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #0222ba;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  & > * {
    margin-bottom: 20px;
  }

  & > h1 {
    font-size: 46px;
    font-weight: bold;
  }
`

const SwapTokens = ({
  selected,
  onSelect: handleSelect,
  type,
  assetList,
  formatTokenName,
}: Props) => {
  const listRef = useRef<HTMLUListElement>(null)
  const { isLoading: isPairsLoading } = usePairs()

  /* search */
  const [searchKeyword, setSearchKeyword] = useState("")
  const [listHeight, setListHeight] = useState(250)

  const filteredAssetList = useMemo(
    () =>
      assetList?.filter(({ contract_addr: contractAddr }) => {
        let symbol = ""
        if (type === Type.WITHDRAW) {
          const tokenInfoList = lpTokenInfos.get(contractAddr)
          symbol = tokenInfoList
            ? tokenInfoList[0].symbol + "-" + tokenInfoList[1].symbol
            : ""
        } else {
          const tokenInfo = tokenInfos.get(contractAddr)
          symbol = tokenInfo ? tokenInfo.symbol : ""
        }

        return (
          symbol.toLowerCase().indexOf(searchKeyword.toLowerCase()) >= 0 ||
          contractAddr.toLowerCase().indexOf(searchKeyword.toLowerCase()) >= 0
        )
      }),
    [assetList, searchKeyword, type]
  )
  const assetElements = useMemo(() => {
    return filteredAssetList?.map((asset) => {
      const { contract_addr, isUnable } = asset
      const isSelected = selected === contract_addr || selected === asset.symbol
      return (
        <li key={`${contract_addr}-${asset.name}-${asset.symbol}`}>
          <button
            type="button"
            className={cx(styles.button, {
              disabled: isUnable,
              selected: isSelected,
            })}
            onClick={() => handleSelect(contract_addr, isUnable)}
          >
            <SwapToken
              {...asset}
              formatTokenName={formatTokenName}
              highlightString={searchKeyword}
            />
          </button>
        </li>
      )
    })
  }, [
    filteredAssetList,
    formatTokenName,
    handleSelect,
    searchKeyword,
    selected,
  ])

  const Row: FC<ListChildComponentProps> = ({ index, style }) => (
    <div style={style}>{assetElements?.[index]}</div>
  )

  useEffect(() => {
    const handleWindowResize = () => {
      setListHeight(listRef.current?.clientHeight || 250)
    }

    window.addEventListener("resize", handleWindowResize)
    handleWindowResize()

    return () => {
      window.removeEventListener("resize", handleWindowResize)
    }
  }, [])

  return (
    <div className={styles.component}>
      <section className={styles.search}>
        <input
          id="search"
          name="search"
          onChange={(e) => setSearchKeyword(e.target.value)}
          autoComplete="off"
          autoFocus
          placeholder="Search name or address"
        />
      </section>

      <ul ref={listRef} className={classNames(styles.list)}>
        {assetElements && !isPairsLoading ? (
          <>
            {assetElements?.length ? (
              <VariableSizeList
                height={listHeight}
                width="100%"
                itemSize={(index) =>
                  isNativeToken(filteredAssetList?.[index].contract_addr || "")
                    ? 75
                    : 75
                }
                itemCount={assetElements.length}
              >
                {Row}
              </VariableSizeList>
            ) : (
              <NoPairs>
                <h1>:(</h1>
                <div>
                  No available pairs yet.
                  <br />
                  We are looking forward to getting the first providing!
                </div>
              </NoPairs>
            )}
          </>
        ) : (
          <div
            style={{
              position: "absolute",
              width: "100%",
              top: "50%",
              left: 0,
            }}
          >
            <Loading color="#0222ba" />
          </div>
        )}
      </ul>
    </div>
  )
}

export default SwapTokens
