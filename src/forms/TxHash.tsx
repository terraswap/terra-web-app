import React from "react"
import { truncate } from "../libs/text"
import { useNetwork } from "../hooks"
import ExtLink from "../components/ExtLink"
import styles from "./TxHash.module.scss"

const TxHash = ({ children: hash }: { children: string }) => {
  const { getFinderUrl } = useNetwork()

  return (
    <ExtLink href={getFinderUrl(hash, "tx")} className={styles.link}>
      {truncate(hash, [10, 10])}
    </ExtLink>
  )
}

export default TxHash
