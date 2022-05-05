import { Box, Heading } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import Input from '../../components/form/Input';
import SubmitBtn from '../../components/form/SubmitBtn';

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(4).required(),
});

export default function Login() {
  return (
    <Box>
      <Heading>Login</Heading>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={({ email, password }, { setSubmitting }) => {
          setTimeout(() => {
            setSubmitting(false);
          }, 5000);
        }}
        validationSchema={schema}
      >
        <Form>
          <Input type="email" name="email" placeholder="you@example.com" />
          <Input
            type="password"
            name="password"
            placeholder="strong password"
          />
          <SubmitBtn>Login</SubmitBtn>
        </Form>
      </Formik>
    </Box>
  );
}
