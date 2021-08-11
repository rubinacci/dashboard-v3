import React from 'react'
import classes from './Loader.module.scss'
import cx from 'classnames'

const Loader = () => {
  return (
    <div className={classes.container}>
      <div className={classes.icon} />
    </div>
  )
}

export default Loader
