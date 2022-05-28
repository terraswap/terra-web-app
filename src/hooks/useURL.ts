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
  const { fcd } = useNetwork()
  const getUrl = useCallback(
    (contract: string, msg: string | object) => {
      const query_msg =
        typeof msg === "string" ? toQueryMsg(msg) : JSON.stringify(msg)
      return `${fcd}/cosmwasm/wasm/v1/contract/${contract}/smart/${window.btoa(
        query_msg
      )}`
    },
    [fcd]
  )
  return getUrl
}
