import React from 'react'
import { MainNavbar } from 'src/components/Navbar'
import HomePage from '../components/HomePage/HomePage'
import { Route } from 'react-router-dom'
import { DietListView } from './DietListView'
import { DietView } from './DietView'
import { AdminPanelView } from './AdminPanelView'
import { LogoutView } from './LogoutView'
import { DietOrderView } from './DietOrderView'

const DashboardView = () => (
  <>
    <MainNavbar />
    <Route path="/panel" exact={true} component={HomePage} />
    <Route path="/panel/logout" exact={true} component={LogoutView} />
    <Route path="/panel/admin" component={AdminPanelView} />
    <Route path="/panel/diets" exact={true} component={DietListView} />
    <Route path="/panel/diets/:dietId" exact={true} component={DietView} />
    <Route path="/panel/diet-order" exact={true} component={DietOrderView} />
  </>
)

export { DashboardView }
