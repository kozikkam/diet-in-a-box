import React from 'react'
import { MainNavbar } from 'src/components/Navbar'
import HomePage from '../components/HomePage/HomePage'
import { Route } from 'react-router-dom'
import { DietsView } from './DietsView'

const DashboardView = () => (
  <React.Fragment>
    <MainNavbar />
    <Route path="/" exact={true}>
      <HomePage />
    </Route>
    <Route path="/diets">
      <DietsView />
    </Route>
  </React.Fragment>
)

export { DashboardView }
