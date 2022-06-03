import { NetworkInfo, useWallet } from "@terra-money/wallet-provider"
import {
  FC,
  PropsWithChildren,
  ReactNode,
  useLayoutEffect,
  useRef,
} from "react"
import { useSearchParams } from "react-router-dom"
import Container from "./Container"
import styles from "./SwapPage.module.scss"

interface Props {
  title?: ReactNode
  description?: ReactNode
  sm?: boolean
}

const Page: FC<PropsWithChildren<Props>> = ({
  title,
  description,
  children,
  ...props
}) => {
  const { sm } = props

  const lastNetworkRef = useRef<NetworkInfo>()
  const { network } = useWallet()
  const [searchParams, setSearchParams] = useSearchParams()

  useLayoutEffect(() => {
    const timerId = setTimeout(() => {
      if (
        network &&
        lastNetworkRef.current &&
        network?.name !== lastNetworkRef.current?.name &&
        window.location.pathname.includes("/swap") &&
        searchParams &&
        setSearchParams
      ) {
        searchParams.set("from", "")
        searchParams.set("to", "")
        setSearchParams(searchParams, { replace: true })
      }
      lastNetworkRef.current = network
    }, 10)

    return () => {
      clearTimeout(timerId)
    }
    // #112: Do not add searchParams, setSearchParams to deps for performance reasons.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network])

  return (
    <article className={styles.article}>
      {sm ? <Container sm>{children}</Container> : children}
    </article>
  )
}

export default Page
