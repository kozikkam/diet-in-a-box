import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { SideNavigation } from 'src/components/SideNavigation'
import { Route, useRouteMatch, Redirect } from 'react-router-dom'
import { DietListView } from './DietListView'
import { DietCard } from 'src/components/DietCard'
import { DietView } from './DietView'
import { RouteBuilder } from './routes'
import { MealListView } from './MealListView'
import { MealView } from './MealView'

const AdminPanelView = () => {
  const { url } = useRouteMatch() as any

  return (
    <Container fluid>
      <Row>
        <Col md={4} lg={2} className="px-0">
          <SideNavigation />
        </Col>
        <Col md={8} lg={10}>
          <Route path={`${url}/`} exact={true}>
            <Redirect to={RouteBuilder.toDietListAdmin()} />
          </Route>
          <Route
            path={`${url}/diets`}
            exact={true}
            component={() => (
              <DietListView
                DietCard={props => <DietCard {...props} editable />}
              />
            )}
          />
          <Route
            path={`${url}/diets/:dietId`}
            exact={true}
            component={() => <DietView editable />}
          />
          <Route
            path={`${url}/meals`}
            exact={true}
            component={() => <MealListView editable />}
          />
          <Route
            path={`${url}/meals/new`}
            exact={true}
            component={() => <MealView editable />}
          />
          <Route
            path={`${url}/meals/:mealId`}
            exact={true}
            component={() => <MealView editable />}
          />
        </Col>
      </Row>
    </Container>
  )
}

export { AdminPanelView }
