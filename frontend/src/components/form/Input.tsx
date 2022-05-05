import { Input as ChakraInput, Text } from '@chakra-ui/react';
import { Field, useField } from 'formik';
import type { FieldAttributes } from 'formik';

export default function Input(props: FieldAttributes<any>) {
  const [, meta] = useField(props.name);

  return (
    <>
      <label>
        {props.label ?? props.name}:
        <Field {...props} as={ChakraInput} />
      </label>
      {meta.touched && meta.error ? (
        <Text color="red">{meta.error}</Text>
      ) : null}
    </>
  );
}
