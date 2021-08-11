import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import Modal from "react-modal"
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useEagerConnect } from './hooks/useEagerConnect'
import { useInactiveListener } from './hooks/useInactiveListener'
import ReactDOM from 'react-dom'
import { Store } from './Store'
import classes from './App.module.scss'
import cx from 'classnames'
// Components
import Sidebar from './Components/Sidebar/Sidebar'
// import Dashboard from './Components/Dashboard'
// import PoolView from './Components/PoolView'
import IndexPage from './pages/IndexPage'
import StaPage from './pages/StaPage'
import PoolPage from './pages/PoolPage'
import MultiPoolPage from './pages/MultiPoolPage'
import Wallet from './Components/Wallet/Wallet'
import Loader from './Components/Loader/Loader'
import { useWeb3React } from '@web3-react/core'
import { CookiesProvider } from 'react-cookie'


Modal.setAppElement('#root')

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

const EagerConnect = () => {
  const triedEager = useEagerConnect()
  useInactiveListener(!triedEager)
  return null
}

const renderLoading = () => {
  ReactDOM.render(<Loader />, document.getElementById("loading"))
}

const App = () => {
  const { activate, deactivate, account, active } = useWeb3React()
  const [menuOpen, setMenuOpen] = useState(false)
  const [walletClosed, setWalletClosed] = useState(false)

  const sidebarDom = (
    <>
      <div className={cx(
        classes.sidebarContainer,
        {
          [classes.open]: menuOpen,
        }
      )}>
        <Sidebar onRouteChange={() => setMenuOpen(false)} />
      </div>
      <div
        onClick={() => setMenuOpen(!menuOpen)}
        className={cx(
          classes.sidebarShade,
          {
            [classes.open]: menuOpen,
          }
        )
      } />
    </>
  )

  const mobileHeaderDom = (
    <div className={cx(
      classes.mobileHeader,
      {
        [classes.menuOpen]: menuOpen,
      }
    )}>
      <div
        className={classes.menuIcon}
        onClick={() => setMenuOpen(!menuOpen)}
      />
      <div className={classes.mobileLogo} />
    </div>
  )

  return (
    <CookiesProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Store>
          <EagerConnect />
          <Router>
            <Switch>
              <Route exact path="/">
                <Redirect to="/sta" />
              </Route>

              <Route path="/sta" render={(props:any) => (
                <div className={classes.app}>
                  { sidebarDom }
                  { mobileHeaderDom }
                  <div className={classes.pageContainer}>
                    <StaPage />
                  </div>
                  <div className={cx(
                    classes.walletContainer,
                    {
                      [classes.closed]: walletClosed,
                    }
                  )}>
                    <Wallet
                      isStaPage={true}
                      onWalletChange={(status:boolean) => setWalletClosed(status)}
                    />
                  </div>
                </div>
              )} />

              <Route path="/pool/:contract_address" render={(props:any) => (
                <div className={classes.app}>
                  { sidebarDom }
                  { mobileHeaderDom }
                  <div className={classes.pageContainer}>
                    <PoolPage />
                  </div>
                  <div className={cx(
                    classes.walletContainer,
                    {
                      [classes.closed]: walletClosed,
                    }
                  )}>
                    <Wallet
                      isStaPage={false}
                      onWalletChange={(status:boolean) => setWalletClosed(status)}
                      poolContractAddress={props.match.params.contract_address}
                    />
                  </div>
                </div>
              )} />

              <Route path="/multi_pool/:contract_address" render={(props:any) => (
                <div className={classes.app}>
                  { sidebarDom }
                  { mobileHeaderDom }
                  <div className={classes.pageContainer}>
                    <MultiPoolPage />
                  </div>
                  <div className={cx(
                    classes.walletContainer,
                    {
                      [classes.closed]: walletClosed,
                    }
                  )}>
                    <Wallet
                      isStaPage={false}
                      onWalletChange={(status:boolean) => setWalletClosed(status)}
                      poolContractAddress={props.match.params.contract_address}
                    />
                  </div>
                </div>
              )} />
            </Switch>
          </Router>
        </Store>
      </Web3ReactProvider>
    </CookiesProvider>
  )
}

export default App
