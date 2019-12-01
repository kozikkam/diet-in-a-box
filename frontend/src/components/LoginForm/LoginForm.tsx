import React from 'react'
import {
  FormGroup,
  InputGroup,
  Card,
  Elevation,
  ICardProps,
  Button,
} from '@blueprintjs/core'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { PasswordInput } from './PasswordInput'
import { connect } from 'react-redux'
import { setLoggedInUser } from 'src/actions'
import { User } from 'src/models'
import { useLoginMutation } from 'src/rest/loginMutation'
import { UserRole } from '../../../../backend/src/api/user/model/UserRole'

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
    password: Yup.string()
      .required('Required'),
})

const mapDispatchToProps = {
  loginUserAction: setLoggedInUser,
}

type Props = ICardProps & typeof mapDispatchToProps

const LoginFormComponent = ({ loginUserAction, ...rest }: Props) => {
  const { mutate: login } = useLoginMutation()

  return (
    <Card elevation={Elevation.TWO} {...rest}>
      <h5>Zaloguj się</h5>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={loginSchema}
        onSubmit={(values, actions) => {
          return login({ email: values.email, password: values.password }).then(resp => {
            loginUserAction({ id: 'foo', email: values.email, role: values.password as UserRole, token: resp.message.token } as User)
          }).catch(err => {
            actions.setStatus(err.data ? err.data.message : err.message)
          })
        }}>
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          isSubmitting,
          status
        }) => (
            <Form>
              <FormGroup
                label="email"
                labelFor="email"
                helperText={touched.email && errors.email}
                intent={touched.email && errors.email ? 'danger' : 'none'}>
                <InputGroup
                  name="email"
                  placeholder="your@email.com"
                  intent={touched.email && errors.email ? 'danger' : 'none'}
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormGroup>
              <FormGroup
                label="hasło"
                labelFor="password"
                helperText={touched.password && errors.password}
                intent={touched.password && errors.password ? 'danger' : 'none'}>
                <PasswordInput
                  name="password"
                  value={values.password}
                  intent={touched.password && errors.password ? 'danger' : 'none'}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormGroup>
              <Button
                intent="success"
                text="Zaloguj"
                type="submit"
                disabled={isSubmitting}
              />
              {status && <p className="text-danger mt-2">{status}</p>}
            </Form>
          )}
      </Formik>
    </Card>
  )
}

const LoginForm = connect(
  null,
  mapDispatchToProps
)(LoginFormComponent)

export { LoginForm }
