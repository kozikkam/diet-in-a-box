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
        <a href={RouteBuilder.toDashboard()}>
        <img className={styles.navbarLogo} src={logo} alt="logo" />
        </a>
      </div>
      <div className="bp3-navbar-group bp3-align-right">
        <Link to={RouteBuilder.toDietList()} className={styles.headerLink}>
          DIETY
        </Link>
        <span className="bp3-navbar-divider"></span>
        <a className={styles.headerLink} href="/">
          MENU
        </a>
        <span className="bp3-navbar-divider"></span>
        <a className={styles.headerLink} href="/">
          GDZIE DOWOZIMY
        </a>
        {loggedInUser && loggedInUser.role !== "user" && (
          <>
            <span className="bp3-navbar-divider"></span>
            <Link to={RouteBuilder.toDieticianPanel()} className={classnames(styles.headerButton, styles.headerButton_success)}>
              PANEL DIETETYKA
            </Link>
          </>
        )}
        <span className="bp3-navbar-divider"></span>
        <a className={classnames(styles.headerButton, styles.headerButton_brand)} href="/">
          ZAMÓW
        </a>
      </div>
    </div>
  </Navbar>
)

export const MainNavbar = connect(mapStateToProps)(MainNavbarComponent)