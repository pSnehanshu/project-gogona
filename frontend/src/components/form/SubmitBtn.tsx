import { Button, Spinner } from '@chakra-ui/react';
import type { ButtonProps } from '@chakra-ui/react';
import { useFormikContext } from 'formik';

export default function SubmitBtn(props: { children?: string } & ButtonProps) {
  const { errors, isSubmitting } = useFormikContext();

  return (
    <Button
      {...props}
      type="submit"
      disabled={Object.values(errors).length > 0 || isSubmitting}
    >
      {isSubmitting ? <Spinner /> : props.children || 'Submit'}
    </Button>
  );
}
