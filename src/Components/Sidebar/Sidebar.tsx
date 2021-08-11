import React, { useEffect } from 'react'
import classes from './Sidebar.module.scss'
import { NavLink } from 'react-router-dom'
import { POOLS } from '../../Constants/Constants'
import { useLocation } from 'react-router-dom'

const Sidebar = (props:any) => {
  let location = useLocation()

  useEffect(() => {
    props.onRouteChange(location)
  }, [location])

  return (
    <>
      <div className={classes.container}>
        <div className={classes.logoContainer}>
            <NavLink
              className={classes.logo}
              to="/sta"
            />
        </div>

        <div className={classes.section}>
          <div className={classes.sectionTitle}>Tokens</div>
          <div className={classes.sectionLinkContainer}>
            <NavLink
              className={classes.sectionLink}
              activeClassName={classes.active}
              to="/sta"
            >
              STA / wSTA
            </NavLink>
          </div>
        </div>

        <div className={classes.section}>
          <div className={classes.sectionTitle}>Dual-Asset Pools</div>
          <div className={classes.sectionLinkContainer}>
            <NavLink
              className={classes.sectionLink}
              activeClassName={classes.active}
              to={`/pool/${POOLS.infinity.contractAddress}`}
            >
              Infinity
            </NavLink>
          </div>
        </div>

        <div className={classes.section}>
          <div className={classes.sectionTitle}>Multi-Asset Pools</div>
          <div className={classes.sectionLinkContainer}>
            <NavLink
              className={classes.sectionLink}
              activeClassName={classes.active}
              to={`/multi_pool/${POOLS.titan.contractAddress}`}
            >
              Titan
            </NavLink>

            <NavLink
              className={classes.sectionLink}
              activeClassName={classes.active}
              to={`/multi_pool/${POOLS.balYielding.contractAddress}`}
            >
              BAL-Yielding
            </NavLink>

            <NavLink
              className={classes.sectionLink}
              activeClassName={classes.active}
              to={`/multi_pool/${POOLS.highRisk.contractAddress}`}
            >
              High-Risk
            </NavLink>

            <NavLink
              className={classes.sectionLink}
              activeClassName={classes.active}
              to={`/multi_pool/${POOLS.lowRisk.contractAddress}`}
            >
              Low-Risk
            </NavLink>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
