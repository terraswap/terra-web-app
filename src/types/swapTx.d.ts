import { Event, TxInfo, TxLog } from "@terra-money/terra.js"

interface FeeAmount {
  amount: string
  denom: string
}

interface SwapAttribute extends EventKV {
  key: string
  value: string
}
interface SwapTxEvent extends Event {
  attributes: SwapAttribute[]
  type: string
}

interface SwapTxLog extends TxLog {
  events: SwapTxEvent[]
}

interface SwapTxInfo extends TxInfo {
  logs: SwapTxLog[]
}
interface SwapTxInfos {
  TxInfos: SwapTxInfo[]
}
