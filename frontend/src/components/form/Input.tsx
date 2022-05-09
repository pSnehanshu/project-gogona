import {
  Box,
  FormControl,
  Text,
  FormLabel,
  Input as ChakraInput,
  Textarea,
  InputGroup,
  InputLeftAddon,
} from '@chakra-ui/react';
import type { BoxProps } from '@chakra-ui/react';
import { Field, useField, useFormikContext } from 'formik';
import type { FieldAttributes } from 'formik';

export default function Input(
  props: {
    label?: string;
    style?: BoxProps;
    leftAddon?: React.ReactNode;
    labelStyles?: React.CSSProperties;
  } & FieldAttributes<unknown>,
) {
  const [, meta] = useField(props.name);
  const { isSubmitting } = useFormikContext();

  const { style, leftAddon, labelStyles, ...fieldProps } = props;

  return (
    <Box my="4" {...style}>
      <FormControl variant="floating">
        <InputGroup>
          {leftAddon && <InputLeftAddon>{leftAddon}</InputLeftAddon>}
          <Field
            {...fieldProps}
            as={props.type === 'textarea' ? Textarea : ChakraInput}
            placeholder=" "
            disabled={isSubmitting}
            bgColor="white"
          />
          <FormLabel style={labelStyles}>{props.label ?? props.name}</FormLabel>
        </InputGroup>
        {meta.touched && meta.error ? (
          <Text color="red.500" px="1" fontSize="sm">
            {meta.error}
          </Text>
        ) : null}
      </FormControl>
    </Box>
  );
}
