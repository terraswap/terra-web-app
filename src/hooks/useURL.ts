import { toBase64 } from "forms/formHelpers"
import { useCallback } from "react"
import { useNetwork } from "."

const toQueryMsg = (msg: string) => {
  try {
    return JSON.stringify(JSON.parse(msg))
  } catch (error) {
    return ""
  }
}

export default () => {
  const { lcd } = useNetwork()
  const getUrl = useCallback(
    (contract: string, msg: string | object, baseUrl?: string) => {
      const query_msg =
        typeof msg === "string" ? toQueryMsg(msg) : JSON.stringify(msg)
      return `${
        baseUrl || lcd
      }/cosmwasm/wasm/v1/contract/${contract}/smart/${toBase64(query_msg)}`
    },
    [lcd]
  )
  return getUrl
}
