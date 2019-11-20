import { Navbar } from '@blueprintjs/core'
import React from 'react'
import logo from 'src/media/logo200.png'
import styles from './styles.module.scss'
import { Link } from 'react-router-dom'
import { RouteBuilder } from 'src/views/routes'

type Props = {}

export const MainNavbar = (props: Props) => (
  <Navbar className={styles.appHeader}>
    <div className={styles.navbarContent}>
      <div className="bp3-navbar-group bp3-align-left">
        <img className={styles.navbarLogo} src={logo} alt="logo" />
      </div>
      <div className="bp3-navbar-group bp3-align-right">
        <Link to={RouteBuilder.toDietList()} className={styles.headerButton}>
          DIETY
        </Link>
        <span className="bp3-navbar-divider"></span>
        <a className={styles.headerButton} href="/">
          MENU
        </a>
        <span className="bp3-navbar-divider"></span>
        <a className={styles.headerButton} href="/">
          GDZIE DOWOZIMY
        </a>
        <span className="bp3-navbar-divider"></span>
        <a className={styles.headerCTAButton} href="/">
          ZAMÓW
        </a>
      </div>
    </div>
  </Navbar>
)
