import React from 'react'
import classes from './WalletStatus.module.scss'
import StaButton from '../StaButton/StaButton'

export const shorter = (str: string | null | undefined) =>
    str && str.length > 8 ? str.slice(0, 6) + '...' + str.slice(-4) : str

const WalletStatus = (props:any) => {
  const { account, onDisconnect } = props

  if (!account) {
    return (
      <div className={classes.container}>
        Not Connected
      </div>
    )
  } else {
    return (
      <div className={classes.containerActive}>
        { shorter(account) }
        <div className={classes.icon} />

        <div className={classes.menu}>
          <div className={classes.menuAccount}>{ account }</div>
          <StaButton onClick={() => onDisconnect()}>
            Disconnect
          </StaButton>
        </div>
      </div>
    )
  }
}

export default WalletStatus
