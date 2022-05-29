import { PropsWithChildren, useEffect } from "react"
import { useWallet, WalletStatus } from "@terra-money/wallet-provider"
import { DefaultOptions } from "@apollo/client"
import Loading from "components/Loading"
import { useModal } from "components/Modal"
import UnsupportedNetworkModal from "components/UnsupportedNetworkModal"
import { AVAILABLE_CHAIN_ID_LIST } from "constants/networks"

export const DefaultApolloClientOptions: DefaultOptions = {
  watchQuery: { notifyOnNetworkStatusChange: true },
  query: { errorPolicy: "all" },
}

const Network: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const { status, network: walletNetwork } = useWallet()
  const unsupportedNetworkModal = useModal()
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (
        walletNetwork &&
        !AVAILABLE_CHAIN_ID_LIST.includes(walletNetwork?.chainID)
      ) {
        unsupportedNetworkModal.open()
      }
    }, 10)

    return () => {
      clearTimeout(timerId)
    }
  }, [unsupportedNetworkModal, walletNetwork])

  return (
    <>
      {status === WalletStatus.INITIALIZING ? (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loading />
        </div>
      ) : (
        !unsupportedNetworkModal.isOpen && children
      )}
      <UnsupportedNetworkModal isOpen={unsupportedNetworkModal.isOpen} />
    </>
  )
}

export default Network
