import React from 'react'
import classes from './PageHeader.module.scss'
import cx from "classnames"


const PageHeader = (props:any) => {
  const { title, price, priceChangePerc } = props


  let priceChangeDom
  if (priceChangePerc && priceChangePerc >= 0) {
    priceChangeDom = <div className={cx(classes.priceChange, classes.green)}>+{ priceChangePerc }% (24h)</div>
  } else if (priceChangePerc && priceChangePerc < 0) {
    priceChangeDom = <div className={cx(classes.priceChange, classes.red)}>{ priceChangePerc }% (24h)</div>
  }


  let priceDom
  if (price) {
    priceDom = (
      <div className={classes.priceContainer}>
        <div className={classes.price}>${ price } USD</div>
        { priceChangeDom }
      </div>
    )
  }

  return (
    <div className={classes.container}>
      <div className={classes.title}>{ title }</div>
      { priceDom }
    </div>
  )
}

export default PageHeader
