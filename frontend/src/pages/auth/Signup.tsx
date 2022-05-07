import {
  Box,
  Heading,
  InputGroup,
  InputLeftAddon,
  Input as ChakraInput,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import {
  ErrorResponse,
  SuccessResponse,
} from '../../../../shared/responses.type';
import Input from '../../components/form/Input';
import SubmitBtn from '../../components/form/SubmitBtn';
import { userAtom } from '../../store/auth';
import { User } from '../../types';
import axios from '../../utils/axios';
import * as yup from 'yup';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useState } from 'react';
import { AxiosError } from 'axios';

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
  hcaptcha: yup.string().required('Captcha is required'),
});

const website = `${window.location.protocol}//${window.location.host}/`;

export default function Signup() {
  const [, setUser] = useAtom(userAtom);
  const navigate = useNavigate();
  const [hcaptchaRef, setHcaptchaRef] = useState<HCaptcha | null>();
  const [error, setError] = useState('');

  return (
    <Box>
      <Heading>Signup as a creator</Heading>

      {error && (
        <Alert status="error" my="6">
          <AlertIcon />
          <AlertTitle>Signup failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Formik
        initialValues={{
          email: '',
          password: '',
          repassword: '',
          name: '',
          handle: '',
          hcaptcha: '',
        }}
        onSubmit={async (
          { email, password, handle, name, hcaptcha },
          { setSubmitting, setFieldValue },
        ) => {
          setError('');
          try {
            // Try login
            const {
              data: { data: user },
            } = await axios.post<SignupResponseData>('auth/signup-creator', {
              email,
              password,
              handle,
              name,
              hcaptcha_token: hcaptcha,
            });

            // Set user to state
            setUser(user);

            // Go to main page
            navigate('/');
          } catch (e) {
            const error = e as AxiosError<ErrorResponse<string>>;
            setError(error.response?.data.message ?? '');
            console.error(error);
          }

          setSubmitting(false);
          hcaptchaRef?.resetCaptcha();
          setFieldValue('hcaptcha', '');
        }}
        validationSchema={schema}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form>
            <Input type="text" name="name" />
            <Input type="email" name="email" />
            <Input type="password" name="password" />
            <Input type="password" name="repassword" label="re-type password" />
            <Input type="text" name="handle" autoComplete="off" />

            <InputGroup>
              <InputLeftAddon children={website} />
              <ChakraInput
                type="text"
                value={values.handle}
                readOnly
                bgColor="white"
              />
            </InputGroup>

            <Box my="4">
              <HCaptcha
                sitekey={process.env.REACT_APP_HCAPTCHA_SITE_KEY!}
                onVerify={(token) => setFieldValue('hcaptcha', token)}
                onExpire={() => setFieldValue('hcaptcha', '')}
                ref={(ref) => setHcaptchaRef(ref)}
              />

              {touched.hcaptcha && errors.hcaptcha ? (
                <Text color="red.500" px="1" fontSize="sm">
                  {errors.hcaptcha}
                </Text>
              ) : null}
            </Box>

            <SubmitBtn w="full" mt="4" colorScheme="twitter">
              Create your account
            </SubmitBtn>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
