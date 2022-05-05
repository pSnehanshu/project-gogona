import {
  Box,
  FormControl,
  Text,
  FormLabel,
  Input as ChakraInput,
} from '@chakra-ui/react';
import type { BoxProps } from '@chakra-ui/react';
import { Field, useField, useFormikContext } from 'formik';
import type { FieldAttributes } from 'formik';

export default function Input(
  props: { label?: string; style?: BoxProps } & FieldAttributes<unknown>,
) {
  const [, meta] = useField(props.name);
  const { isSubmitting } = useFormikContext();

  const { style, ...fieldProps } = props;

  return (
    <Box my="4" {...style}>
      <FormControl variant="floating">
        <Field
          {...fieldProps}
          as={ChakraInput}
          placeholder=" "
          disabled={isSubmitting}
          bgColor="white"
        />
        <FormLabel>{props.label ?? props.name}</FormLabel>
        {meta.touched && meta.error ? (
          <Text color="red.500" px="1" fontSize="sm">
            {meta.error}
          </Text>
        ) : null}
      </FormControl>
    </Box>
  );
}
