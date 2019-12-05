import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Diet } from 'src/models'
import { useDietsQuery } from 'src/rest'

type Props = {
  //DietSchedule?: (props: DietScheduleProps) => JSX.Element
}

const DietOrderView = (props: Props) => {
  const { data, loading } = useDietsQuery()
  const diets: Diet[] | null = (loading || !data) ? null : data || null
  console.log(diets)

  return (
    <Container>
      <Row>
        <h1>Nowe zamówienie</h1>
      </Row>
      <Row>
        <Col md="6" className="px-0">
          <Row>
            <Col md="6" className="px-0">
              <b>DIETA:</b>
            </Col>
            <Col md="6" className="px-0">
              
            </Col>
          </Row>
        </Col>
        <Col md="6" className="px-0">

        </Col>
      </Row>
    </Container>
  )
}

export { DietOrderView }
