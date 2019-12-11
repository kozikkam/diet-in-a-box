import React, { useState } from 'react'
import { Container, Row, Col, Alert, Toast } from 'react-bootstrap'
import { Diet } from 'src/models'
import { useCreateDietOrderMutation, useDietListQuery } from 'src/rest'
import { Button, MenuItem, NumericInput, InputGroup } from '@blueprintjs/core'
import { TimePicker, DateRangePicker } from '@blueprintjs/datetime'
import { Select, IItemRendererProps } from '@blueprintjs/select'
import { useKcalOptionsQuery } from 'src/rest/kcalOptionsQuery'
import { IKcalOption } from '../../../backend/src/api/diet/model/KcalOptions'
import { ELEVATION_1 } from '@blueprintjs/core/lib/esm/common/classes'
import { handleStringChange } from "@blueprintjs/docs-theme"
import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css'
import styles from './DietOrderView.module.scss'
import moment from 'moment'

type Props = { }

const DietOrderView = (props: Props) => {
  const dietsQueryResponse = useDietListQuery()
  const kcalQueryResponse = useKcalOptionsQuery()
  const { mutate } = useCreateDietOrderMutation()
  const diets: Diet[] = (dietsQueryResponse.loading || !dietsQueryResponse.data) ? [] : dietsQueryResponse.data
  const kcals: IKcalOption[] = (kcalQueryResponse.loading || !kcalQueryResponse.data) ? [] : kcalQueryResponse.data
  const [selectedDiet, setSelectedDiet] = useState(diets[0])
  const [selectedKcal, setSelectedKcal] = useState(kcals[0])
  const [destinationAddress, setDestinationAddress] = useState('')
  const [deliveryHour, setDeliveryHour] = useState('')
  const [selectedDates, setSelectedDates] = useState([])
  const [sendingForm, setSendingForm] = useState(false)
  const [showErrorNotification, setShowErrorNotification] = useState(false)
  const [formSent, setFormSent] = useState(false)

  const [dietFilled, setDietFilled] = useState(true)
  const [kcalFilled, setKcalFilled] = useState(true)
  const [datesFilled, setDatesFilled] = useState(true)
  const [destinationAddressFilled, setDestinationAddressFilled] = useState(true)
  const [deliveryHourFilled, setDeliveryHourFilled] = useState(true)

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

  const handleAddressChange = handleStringChange((value: string) => setDestinationAddress(value))

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

  const enumerateDaysBetweenDates = (startDate: string, endDate: string) => {
    const dates = []

    const currDate = moment(startDate).startOf('day')
    const lastDate = moment(endDate).startOf('day')

    while (currDate.add(1, 'days').diff(lastDate) < 0) {
      dates.push(currDate.clone().toISOString())
    }

    return dates
  }

  const calculateEndPrice = () => {
    return Math.round(daysNumber * (selectedDiet || {}).dailyCost + (selectedKcal || {}).extraCost)
  }

  const submitForm = async () => {
    setSendingForm(true)

    if (!selectedDiet) {
      setDietFilled(false)
    } else {
      setDietFilled(true)
    }

    if (!selectedKcal) {
      setKcalFilled(false)
    } else {
      setKcalFilled(true)
    }

    if (!selectedDates.length) {
      setDatesFilled(false)
    } else {
      setDatesFilled(true)
    }

    if (!destinationAddress) {
      setDestinationAddressFilled(false)
    } else {
      setDestinationAddressFilled(true)
    }

    if (!deliveryHour) {
      setDeliveryHourFilled(false)
    } else {
      setDeliveryHourFilled(true)
    }

    if (!selectedDiet || !selectedKcal || !selectedDates.length || !destinationAddress || !deliveryHour) {
      setSendingForm(false)
      return
    }

    let actualSelectedDates: string[]
    if (daysNumber === 1) {
      actualSelectedDates = selectedDates[0]
    } else {
      actualSelectedDates = enumerateDaysBetweenDates(selectedDates[0], selectedDates[1])
    }

    try {
      await mutate({
        dietId: selectedDiet._id,
        dates: actualSelectedDates,
        kcal: selectedKcal.value,
        deliveryAddress: destinationAddress,
        deliveryTime: deliveryHour,
      })
    } catch (error) {
      setShowErrorNotification(true)
      setSendingForm(false)
      return
    }

    setShowErrorNotification(true)
    setSendingForm(false)
    setFormSent(true)
    return
  }

  if (!dietsQueryResponse.loading && !selectedDiet) {
    setSelectedDiet(diets[0])
  }
  if (!kcalQueryResponse.loading && !selectedKcal) {
    setSelectedKcal(kcals[0])
  }

  if (formSent) {
    return (
      <div>
        <Row style={{ marginTop: 50 }}>
          <Col md="3"></Col>
          <Col md="6">
            Dziękujemy za zamówienie diety. Aby dokończyć proces, konieczne jest dokonanie opłaty. Prosimy o przelew
          na kwotę {calculateEndPrice()}zł na numer konta 1234 5678 9012 3456 7890. Po zaksięgowaniu wpłaty
            zamówienie zostanie zrealizowane.
        </Col>
          <Col md="3"></Col>
        </Row>
      </div>
    )
  }

  return (
    <Container>
      <Row style={{ marginTop: 20, marginBottom: 20 }}>
        <h1>Nowe zamówienie</h1>
      </Row>
      <Row style={{ marginTop: 20, marginBottom: 20 }}>
        <Col md='6'>
          <Row style={{ marginTop: 20, marginBottom: 20 }}>
            <Col md='6'>
              <b>DIETA:</b>
            </Col>
            <Col md='6'>
              <DietSelect
                items={diets}
                itemRenderer={renderDietItem}
                noResults={<MenuItem disabled={true} text='BRAK DIET' />}
                onItemSelect={(item: Diet) => { setSelectedDiet(item) }}
                className={dietFilled ? '' : styles.error}
              >
                {/* children become the popover target; render value here */}
                <Button text={`${(selectedDiet || {}).name} ${(selectedDiet || {}).dailyCost}zł`} rightIcon='double-caret-vertical' />
              </DietSelect>
            </Col>
          </Row>
          <Row style={{ marginTop: 20, marginBottom: 20 }}>
            <Col md='6'>
              <b>KALORYCZNOŚĆ:</b>
            </Col>
            <Col md='6'>
              <CaloriesSelect
                items={kcals}
                itemRenderer={renderKcalItem}
                noResults={<MenuItem disabled={true} text='' />}
                onItemSelect={(item: IKcalOption) => { setSelectedKcal(item); setKcalFilled(true) }}
                className={kcalFilled ? '' : styles.error}
              >
                {/* children become the popover target; render value here */}
                <Button text={(selectedKcal || {}).value} rightIcon='double-caret-vertical' />
              </CaloriesSelect>
            </Col>
          </Row>
          <Row style={{ marginTop: 20, marginBottom: 20 }}>
            <Col md='6'>
              <b>DNI:</b>
            </Col>
            <Col md='6'>
              <NumericInput disabled={true} value={daysNumber} min={0} />
            </Col>
          </Row>
          <Row style={{ marginTop: 20, marginBottom: 20 }}>
            <DateRangePicker
              className={`${ELEVATION_1} ${datesFilled ? '' : styles.error}`}
              minDate={moment().subtract({ months: 1 }).toDate()}
              maxDate={moment().add({ months: 1 }).toDate()}
              shortcuts={false}
              onChange={(event: any) => { setSelectedDates(event) }}
              onHoverChange={() => setDatesFilled(true)}
            />
          </Row>
        </Col>
        <Col md='6'>
          <Row style={{ marginTop: 20, marginBottom: 20 }}>
            <Col md='12' className='px-0'>
              <b>MIEJSCE DOSTAWY</b>
            </Col>
            <Col md='12' className='px-0'>
              <InputGroup
                className={destinationAddressFilled ? '' : styles.error}
                large={true}
                placeholder='np. Ul. Nowacka 12/2 44-121 Wrocław'
                onChange={handleAddressChange}
                onSelect={() => setDestinationAddressFilled(true)}
              />
            </Col>
          </Row>
          <Row style={{ marginTop: 20, marginBottom: 20 }}>
            <Col md='12' className='px-0'>
              <b>GODZINA DOSTAWY</b>
            </Col>
            <Col md='12' className='px-0'>
              <TimePicker
                className={deliveryHourFilled ? '' : styles.error}
                onChange={(event: any) => { setDeliveryHour(event) }} />
            </Col>
          </Row>
          <Row style={{ marginTop: 20, marginBottom: 20, textAlign: 'center' }}>
            <Col md='12'>
              <b>DO ZAPŁATY:</b>
            </Col>
            <Col md='12'>
              <b>{daysNumber} * ({(selectedDiet || {}).dailyCost} + {(selectedKcal || {}).extraCost}) = {calculateEndPrice()}zł</b>
            </Col>
            <Col md='12' style={{ marginTop: 20 }}>
              <Button intent='success' text='ZAMAWIAM' disabled={sendingForm} onClick={submitForm} />
            </Col>
          </Row>
        </Col>
      </Row>
      <Alert show={showErrorNotification} variant='danger'>
        <Toast.Body>Bład w systemie, prosimy spróbować ponownie</Toast.Body>
      </Alert>
    </Container>
  )
}

export { DietOrderView }
