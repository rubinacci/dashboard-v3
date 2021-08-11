import React from 'react'
import classes from './StaButton.module.scss'

const StaButton = (props:any) => {
  const { onClick, to, target, children, style } = props

  if (to) {
    return (
      <a href={to} target={target} className={classes.container} style={style}>
        { children }
      </a>
    )
  } else {
    return (
      <div onClick={onClick} className={classes.container} style={style}>
        { children }
      </div>
    )
  }
}

export default StaButton
