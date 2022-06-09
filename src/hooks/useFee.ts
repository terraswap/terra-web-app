import { CreateTxOptions, Fee } from "@terra-money/terra.js"
import { useLCDClient } from "@terra-money/wallet-provider"
import { useEffect, useRef, useState } from "react"
import useAddress from "./useAddress"

const useFee = (createTxOptions?: CreateTxOptions) => {
  const terra = useLCDClient()
  const walletAddress = useAddress()

  const [fee, setFee] = useState<Fee | undefined>(undefined)
  const [isCalculating, setIsCalculating] = useState(false)

  const isCalculated = useRef(false)
  const calculatedTxOptions = useRef<CreateTxOptions | undefined>(undefined)

  useEffect(() => {
    let isAborted = false
    const fetchFee = async () => {
      try {
        if (isAborted) {
          return
        }
        if (
          createTxOptions &&
          calculatedTxOptions.current !== createTxOptions
        ) {
          const tx = await terra.tx.create(
            [{ address: walletAddress }],
            createTxOptions
          )

          if (isAborted) {
            return
          }
          if (tx?.auth_info?.fee) {
            setFee(tx.auth_info.fee)
          } else {
            setFee(undefined)
          }
        }
      } catch (error) {
        console.log(error)
        setFee(undefined)
      }
      if (isAborted) {
        return
      }
      calculatedTxOptions.current = createTxOptions
      setIsCalculating(false)
    }

    setIsCalculating(true)
    setTimeout(() => fetchFee(), isCalculated.current ? 1250 : 0)

    return () => {
      isAborted = true
    }
  }, [terra.tx, createTxOptions, walletAddress])

  return { fee, isCalculating, createTxOptions: calculatedTxOptions.current }
}
export default useFee
