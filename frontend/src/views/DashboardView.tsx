import React from 'react'
import { MainNavbar } from 'src/components/Navbar'
import HomePage from '../components/HomePage/HomePage'
import { Route } from 'react-router-dom'
import { DietListView } from './DietListView'
import { DietView } from './DietView'

const DashboardView = () => (
  <>
    <MainNavbar />
    <Route path="/panel" exact={true}>
      <HomePage />
    </Route>
    <Route path="/panel/diets" component={DietListView} />
    <Route path="/panel/diets/:dietId" exact={true} component={DietView} />
  </>
)

export { DashboardView }
