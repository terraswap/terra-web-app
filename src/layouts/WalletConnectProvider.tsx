import {
  WalletProvider,
  getChainOptions,
  WalletControllerChainOptions,
} from "@terra-money/wallet-provider"
import { PropsWithChildren, useEffect, useState } from "react"
import { useModal } from "components/Modal"
import ConnectListModal from "./ConnectListModal"
import { ConnectModalProvider } from "hooks/useConnectModal"

const WalletConnectProvider: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const modal = useModal()

  const [chainOptions, setChainOptions] =
    useState<WalletControllerChainOptions>()

  useEffect(() => {
    getChainOptions().then((chainOptions) => setChainOptions(chainOptions))
  }, [])

  return chainOptions ? (
    <WalletProvider {...chainOptions}>
      <ConnectModalProvider value={modal}>
        <ConnectListModal {...modal} isCloseBtn />
        {children}
      </ConnectModalProvider>
    </WalletProvider>
  ) : (
    <></>
  )
}
export default WalletConnectProvider
