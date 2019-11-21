import React from 'react'
import { DailyDiet, MEAL_TIME } from 'src/models'
import { Table } from 'react-bootstrap'
//import style from './DietSchedule.module.scss'

const MEAL_TIME_TRANSLATION: Record<MEAL_TIME, string> = {
  breakfast: 'śniadanie',
  afternoonSnack: 'popołudniowa przekąska',
  dinner: 'kolacja',
  lunch: 'lunch',
  morningSnack: 'podwieczorek',
}

type Props = {
  dailyDiets: DailyDiet[]
}

const DietSchedule = ({ dailyDiets }: Props) => (
  <Table responsive>
    <thead>
      <tr>
        <th>Dzień</th>
        {Object.values(MEAL_TIME_TRANSLATION).map(meal => (
          <th key={meal}>{meal}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {dailyDiets.map(diet => (
        <tr key={diet.id}>
          <td>{diet.date.toString()}</td>
          {Object.entries(MEAL_TIME_TRANSLATION).map(([key, _]) => (
            <th key={key}>{key}</th>
          ))}
        </tr>
      ))}
    </tbody>
  </Table>
)

export { DietSchedule }
