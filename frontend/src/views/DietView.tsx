import React from 'react'
import { Container } from 'react-bootstrap'
import { Diet } from 'src/models'
import { DietList } from 'src/components/DietList'
import { useParams } from 'react-router-dom'

const diets: Diet[] = [
  { id: '1', name: 'dieta 1', dailyCost: 123 },
  { id: '2', name: 'dieta 2', dailyCost: 50 },
  { id: '3', name: 'dieta 3', dailyCost: 34 },
  { id: '4', name: 'dieta 4', dailyCost: 2 },
]

const DietView = () => {
  const { dietId } = useParams()

  return (
    <Container fluid={true}>
      <h1>Dieta {dietId}</h1>
    </Container>
  )
}

export { DietView }
