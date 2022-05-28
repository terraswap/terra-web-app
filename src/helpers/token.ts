import DefaultTokenIcon from "images/Token/Token.svg"
import { getSymbol } from "libs/utils"
import { tokenInfos } from "rest/usePairs"

import { ULUNA } from "../constants/constants"

export const hasTaxToken = (contract_addr: string) => {
  if (contract_addr === ULUNA || contract_addr.startsWith("terra")) {
    return false
  }

  return true
}

export const GetTokenSvg = (icon?: string, symbol?: string) => {
  if (icon && icon !== "") {
    return icon
  }
  if (!symbol) {
    return ""
  }

  const denom = getSymbol(symbol)
  const tokenInfo = tokenInfos.get(denom ?? symbol)
  if (tokenInfo && tokenInfo.icon !== "") {
    return tokenInfo.icon
  }

  return DefaultTokenIcon
}
