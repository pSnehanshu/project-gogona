import { Box, Heading } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/form/Input';
import SubmitBtn from '../../components/form/SubmitBtn';
import axios from '../../utils/axios';
import type { SuccessResponse } from '../../../../shared/responses.type';
import type { User } from '../../types';
import { userAtom } from '../../store/auth';

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(4).required(),
});

type LoginResponseData = SuccessResponse<User>;

export default function Login() {
  const [, setUser] = useAtom(userAtom);
  const navigate = useNavigate();

  return (
    <Box>
      <Heading textAlign="center">Login as a creator</Heading>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={async ({ email, password }, { setSubmitting }) => {
          try {
            // Try login
            const {
              data: { data: user },
            } = await axios.post<LoginResponseData>('auth/login', {
              email,
              password,
            });

            // Set user to state
            setUser(user);

            // Go to main page
            navigate('/');
          } catch (error) {
            console.error(error);
          }
          setSubmitting(false);
        }}
        validationSchema={schema}
      >
        <Form>
          <Input type="email" name="email" />
          <Input type="password" name="password" />
          <SubmitBtn w="full" mt="4" colorScheme="twitter">
            Login
          </SubmitBtn>
        </Form>
      </Formik>
    </Box>
  );
}
