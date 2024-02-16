import React from 'react'
import { Form } from 'react-bootstrap'
import { Field } from 'formik'
import { PatternFormat } from 'react-number-format'

const MaskedFormTextField = ({
  md,
  controlId,
  label,
  name,
  required,
  placeholder,
  format,
  mask,
}) => {
  return (
    <Field name={name}>
      {({ field, form }) => {
        const isValid = !form.errors[field.name]
        const isInvalid = form.touched[field.name] && !isValid

        return (
          <Form.Group md={md} controlId={controlId}>
            <Form.Label>
              {label}
              {required && <span style={{ color: 'red' }}>*</span>}
            </Form.Label>
            <Form.Control
              {...field}
              as={PatternFormat}
              format={format}
              mask={mask}
              type="text"
              isValid={form.touched[field.name] && isValid}
              isInvalid={isInvalid}
              feedback={form.errors[field.name]}
              placeholder={placeholder}
            />
            <Form.Control.Feedback type="invalid">
              {form.errors[field.name]}
            </Form.Control.Feedback>
          </Form.Group>
        )
      }}
    </Field>
  )
}

export default MaskedFormTextField
