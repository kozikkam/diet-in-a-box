import React from 'react'
import { Card, Elevation, ICardProps } from '@blueprintjs/core'
import { Diet } from 'src/models'
import style from './DietCard.module.scss'
import { Link } from 'react-router-dom'
import { RouteBuilder } from 'src/views/routes'

type Props = {
  data: Diet
} & ICardProps

const DietCard = ({
  data: { id, name, dailyCost },
  className,
  ...rest
}: Props) => (
  <Card
    elevation={Elevation.TWO}
    className={`${style.dietCard} ${className || ''}`}
    {...rest}>
    <h5 className={style.name}>{name}</h5>
    <span className={style.cost}>{dailyCost}zł / dzień</span>
    <div className={style.navigation}>
      <Link
        to={RouteBuilder.toDiet(id)}
        className="bp3-button bp3-intent-success">
        Pokaż
      </Link>
    </div>
  </Card>
)

export { DietCard }
