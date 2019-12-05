import React, { useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Diet } from 'src/models'
import { useDietsQuery } from 'src/rest'
import { Button, MenuItem, NumericInput, InputGroup } from "@blueprintjs/core";
import { TimePicker, DateRangePicker } from "@blueprintjs/datetime";
import { Select, IItemRendererProps } from "@blueprintjs/select";
import { useKcalOptionsQuery } from 'src/rest/kcalOptionsQuery';
import { IKcalOption } from '../../../backend/src/api/diet/model/KcalOptions';
import { ELEVATION_1 } from '@blueprintjs/core/lib/esm/common/classes';
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import moment from 'moment';

type Props = {
  //DietSchedule?: (props: DietScheduleProps) => JSX.Element
}

// Select<T> is a generic component to work with your data types.
// In TypeScript, you must first obtain a non-generic reference:

const DietOrderView = (props: Props) => {
  const dietsQueryResponse = useDietsQuery()
  const kcalQueryResponse = useKcalOptionsQuery()
  const diets: Diet[] = (dietsQueryResponse.loading || !dietsQueryResponse.data) ? [] : dietsQueryResponse.data
  const kcals: IKcalOption[] = (kcalQueryResponse.loading || !kcalQueryResponse.data) ? [] : kcalQueryResponse.data
  const [selectedDiet, setSelectedDiet] = useState(diets[0])
  const [selectedKcal, setSelectedKcal] = useState(kcals[0])
  const [destinationAddress, setDestinationAddress] = useState("")
  const [deliveryHour, setDeliveryHour] = useState("")
  const [selectedDates, setSelectedDates] = useState([])
  let daysNumber: number
  if (!selectedDates.length) {
    daysNumber = 0
  } else if (!selectedDates[1]) {
    daysNumber = 1
  } else {
    daysNumber = moment(selectedDates[1]).diff(moment(selectedDates[0]), 'days') + 1
  }
  const DietSelect = Select.ofType<Diet>()
  const CaloriesSelect = Select.ofType<IKcalOption>()

  console.log(daysNumber)
  console.log(destinationAddress)
  console.log(deliveryHour)
  console.log(selectedDates)

  // const handleSubmit = () => {
  // }

  const renderDietItem = (
    item: Diet,
    props: IItemRendererProps,
  ) => {
    return (
      <MenuItem
        text={`${item.name} ${item.dailyCost}zł`}
        active={props.modifiers.active}
        onClick={props.handleClick}
        shouldDismissPopover={false}
      />
    )
  }

  const renderKcalItem = (
    item: IKcalOption,
    props: IItemRendererProps,
  ) => {
    return (
      <MenuItem
        text={item.value}
        active={props.modifiers.active}
        onClick={props.handleClick}
        shouldDismissPopover={false}
      />
    )
  }

  if (!dietsQueryResponse.loading && !selectedDiet) {
    setSelectedDiet(diets[0])
  }
  if (!kcalQueryResponse.loading && !selectedKcal) {
    setSelectedKcal(kcals[0])
  }

  return (
    <Container>
      <Row style={{ marginTop: 20, marginBottom: 20 }}>
        <h1>Nowe zamówienie</h1>
      </Row>
      <Row style={{ marginTop: 20, marginBottom: 20 }}>
        <Col md="6">
          <Row style={{ marginTop: 20, marginBottom: 20 }}>
            <Col md="6">
              <b>DIETA:</b>
            </Col>
            <Col md="6">
              <DietSelect
                items={diets}
                itemRenderer={renderDietItem}
                noResults={<MenuItem disabled={true} text="BRAK DIET" />}
                onItemSelect={(item: Diet) => { setSelectedDiet(item) }}
              >
                {/* children become the popover target; render value here */}
                <Button text={`${(selectedDiet || {}).name} ${(selectedDiet || {}).dailyCost}zł`} rightIcon="double-caret-vertical" />
              </DietSelect>
            </Col>
          </Row>
          <Row style={{ marginTop: 20, marginBottom: 20 }}>
            <Col md="6">
              <b>KALORYCZNOŚĆ:</b>
            </Col>
            <Col md="6">
              <CaloriesSelect
                items={kcals}
                itemRenderer={renderKcalItem}
                noResults={<MenuItem disabled={true} text="" />}
                onItemSelect={(item: IKcalOption) => { setSelectedKcal(item) }}
              >
                {/* children become the popover target; render value here */}
                <Button text={(selectedKcal || {}).value} rightIcon="double-caret-vertical" />
              </CaloriesSelect>
            </Col>
          </Row>
          <Row style={{ marginTop: 20, marginBottom: 20 }}>
            <Col md="6">
              <b>DNI:</b>
            </Col>
            <Col md="6">
              <NumericInput disabled={true} value={daysNumber} min={0} />
            </Col>
          </Row>
          <Row style={{ marginTop: 20, marginBottom: 20 }}>
            <DateRangePicker
              className={ELEVATION_1}
              minDate={moment().subtract({ months: 1 }).toDate()}
              maxDate={moment().add({ months: 1 }).toDate()}
              shortcuts={false}
              onChange={(event: any) => setSelectedDates(event)}
            />
          </Row>
        </Col>
        <Col md="6">
          <Row style={{ marginTop: 20, marginBottom: 20 }}>
            <Col md="12" className="px-0">
              <b>MIEJSCE DOSTAWY</b>
            </Col>
            <Col md="12" className="px-0">
              <InputGroup
                large={true}
                placeholder="np. Ul. Nowacka 12/2 44-121 Wrocław"
                onChange={(event: any) => setDestinationAddress(event.value)}
              />
            </Col>
          </Row>
          <Row style={{ marginTop: 20, marginBottom: 20 }}>
            <Col md="12" className="px-0">
              <b>GODZINA DOSTAWY</b>
            </Col>
            <Col md="12" className="px-0">
              <TimePicker onChange={(event: any) => setDeliveryHour(event)} />
            </Col>
          </Row>
          <Row style={{ marginTop: 20, marginBottom: 20, textAlign: "center" }}>
            <Col md="12">
              <b>DO ZAPŁATY:</b>
            </Col>
            <Col md="12">
              <b>{daysNumber} * {(selectedDiet || {}).dailyCost}zł = {daysNumber * (selectedDiet || {}).dailyCost}zł</b>
            </Col>
            <Col md="12" style={{ marginTop: 20 }}>
              <Button intent="success" text="ZAMAWIAM" />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}

export { DietOrderView }
