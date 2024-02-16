import React from 'react'
import { Form } from 'react-bootstrap'
import { Field } from 'formik'

const FormSelectField = ({
  as,
  md,
  controlId,
  label,
  name,
  type,
  required,
  children,
  isDisabled,
}) => {
  return (
    <Field name={name}>
      {({ field, form }) => {
        const isValid = !form.errors[field.name]
        const isInvalid = form.touched[field.name] && !isValid
        return (
          <Form.Group as={as} md={md} controlId={controlId}>
            <Form.Label>
              {label}
              {required && <span style={{ color: 'red' }}>*</span>}
            </Form.Label>
            <Form.Select
              {...field}
              type={type}
              isValid={form.touched[field.name] && isValid}
              isInvalid={isInvalid}
              feedback={form.errors[field.name]}
              disabled={isDisabled}
              as="select"
            >
              {children}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {form.errors[field.name]}
            </Form.Control.Feedback>
          </Form.Group>
        )
      }}
    </Field>
  )
}

FormSelectField.defaultProps = {
  type: 'select',
}

export default FormSelectField
