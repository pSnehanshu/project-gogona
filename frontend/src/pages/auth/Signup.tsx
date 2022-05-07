import {
  Box,
  Heading,
  InputGroup,
  InputLeftAddon,
  Input as ChakraInput,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { SuccessResponse } from '../../../../shared/responses.type';
import Input from '../../components/form/Input';
import SubmitBtn from '../../components/form/SubmitBtn';
import { userAtom } from '../../store/auth';
import { User } from '../../types';
import axios from '../../utils/axios';
import * as yup from 'yup';

type SignupResponseData = SuccessResponse<User>;

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(4).required(),
  repassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
  name: yup.string().required(),
  handle: yup
    .string()
    .min(3)
    .max(15)
    .matches(
      /^@?(\w)+$/,
      'Handle can contain only letters, numbers, and underscore',
    )
    .required(),
});

const website = `${window.location.protocol}//${window.location.host}/`;

export default function Signup() {
  const [, setUser] = useAtom(userAtom);
  const navigate = useNavigate();

  return (
    <Box>
      <Heading>Signup</Heading>

      <Formik
        initialValues={{
          email: '',
          password: '',
          repassword: '',
          name: '',
          handle: '',
        }}
        onSubmit={async (
          { email, password, handle, name },
          { setSubmitting },
        ) => {
          try {
            // Try login
            const {
              data: { data: user },
            } = await axios.post<SignupResponseData>('auth/signup-creator', {
              email,
              password,
              handle,
              name,
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
        {({ values }) => (
          <Form>
            <Input type="text" name="name" />
            <Input type="email" name="email" />
            <Input type="password" name="password" />
            <Input type="password" name="repassword" label="re-type password" />
            <Input type="text" name="handle" autoComplete="off" />

            <InputGroup>
              <InputLeftAddon children={website} />
              <ChakraInput type="text" value={values.handle} bgColor="white" />
            </InputGroup>

            <SubmitBtn w="full" mt="4" colorScheme="twitter">
              Signup
            </SubmitBtn>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
