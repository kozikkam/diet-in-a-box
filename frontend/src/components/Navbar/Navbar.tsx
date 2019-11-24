import { Navbar } from '@blueprintjs/core'
import React from 'react'
import logo from 'src/media/logo200.png'
import styles from './styles.module.scss'
import { Link } from 'react-router-dom'
import { RouteBuilder } from 'src/views/routes'
import { AppState } from 'src/store/types'
import { connect } from 'react-redux'
import classnames from "classnames"

const mapStateToProps = (state: AppState) => ({
  loggedInUser: state.user.loggedInUser,
})

type Props = {} & ReturnType<typeof mapStateToProps>

const MainNavbarComponent = ({ loggedInUser }: Props) => (
  <Navbar className={styles.appHeader} fixedToTop>
    <div className={styles.navbarContent}>
      <div className="bp3-navbar-group bp3-align-left">
        <Link to={RouteBuilder.toDashboard()}>
        <img className={styles.navbarLogo} src={logo} alt="logo" />
        </Link>
      </div>
      <div className="bp3-navbar-group bp3-align-right">
        <Link to={RouteBuilder.toDietList()} className={styles.headerLink}>
          DIETY
        </Link>
        <span className="bp3-navbar-divider"></span>
        <Link className={styles.headerButton} to="/">
          MENU
        </Link>
        <span className="bp3-navbar-divider"></span>
        <Link className={styles.headerLink} to="/">
          GDZIE DOWOZIMY
        </Link>
        {loggedInUser && loggedInUser.role !== "user" && (
          <>
            <span className="bp3-navbar-divider"></span>
            <Link to={RouteBuilder.toDieticianPanel()} className={classnames(styles.headerButton, styles.headerButton_success)}>
              PANEL DIETETYKA
            </Link>
          </>
        )}
        <span className="bp3-navbar-divider"></span>
        <Link className={classnames(styles.headerButton, styles.headerButton_brand)} to="/">
          ZAMÓW
        </Link>
      </div>
    </div>
  </Navbar>
)

export const MainNavbar = connect(mapStateToProps)(MainNavbarComponent)