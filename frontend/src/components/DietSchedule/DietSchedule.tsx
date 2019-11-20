import React from 'react'
import { Diet } from 'src/models'
import { Table } from 'react-bootstrap'
//import style from './DietSchedule.module.scss'

type Props = {
  diet: Diet
}

const DietSchedule = ({ diet }: Props) => (
  <Table responsive>
    <thead>
      <tr>
        <th>First</th>
        <th>Last</th>
        <th>Handle</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Mark</td>
        <td>Otto</td>
        <td>@mdo</td>
      </tr>
    </tbody>
  </Table>
)

export { DietSchedule }
