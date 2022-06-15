import { CreateTxOptions, Fee, LCDClient } from "@terra-money/terra.js"
import { useLCDClient } from "@terra-money/wallet-provider"
import { useEffect, useRef, useState } from "react"
import useAddress from "./useAddress"

export const calculateFee = async (
  lcd: LCDClient,
  walletAddress: string,
  createTxOptions: CreateTxOptions
) => {
  try {
    const tx = await lcd.tx.create(
      [{ address: walletAddress }],
      createTxOptions
    )
    return tx?.auth_info?.fee
  } catch (error) {
    console.log(error)
  }
  return undefined
}

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
          const calculatedFee = await calculateFee(
            terra,
            walletAddress,
            createTxOptions
          )

          if (isAborted) {
            return
          }
          setFee(calculatedFee)
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
  }, [createTxOptions, walletAddress, terra])

  return { fee, isCalculating, createTxOptions: calculatedTxOptions.current }
}
export default useFee
