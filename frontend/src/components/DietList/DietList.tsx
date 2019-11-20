import React from 'react'
import { Diet } from 'src/models'
import { DietCard } from 'src/components/DietCard'
import style from './DietList.module.scss'

type Props = {
  diets: Diet[]
}

const DietList = ({ diets }: Props) => (
  <div className={style.dietContainer}>
    {diets.map(diet => (
      <DietCard data={diet} key={diet.id} className={style.dietCard} />
    ))}
  </div>
)

export { DietList }
