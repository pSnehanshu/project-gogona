import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useAtom } from 'jotai';
import { SuccessResponse } from '../../../../../shared/responses.type';
import Input from '../../../components/form/Input';
import SubmitBtn from '../../../components/form/SubmitBtn';
import { userAtom } from '../../../store/auth';
import type { User } from '../../../types';
import axios from '../../../utils/axios';
import * as yup from 'yup';
import { createContext, useState } from 'react';

export const SubscriberLoginContext = createContext<
  (() => Promise<User>) | null
>(null);

type PropsType = {
  onLoginSuccess?: (user: User) => void;
  onLoginCancel?: () => void;
};

const sendOTPSchema = yup.object().shape({
  phone: yup
    .string()
    .matches(/^[1-9]{1}[0-9]{9}$/, 'Must be a valid 10 digit phone number'),
});

const verifyOTPSchema = yup.object().shape({
  otp: yup
    .string()
    .length(5)
    .matches(/^[0-9]+$/, 'Must be numeric'),
});

export default function SubscriberLogin(props: PropsType) {
  const [, setUser] = useAtom(userAtom);
  const [userId, setUserId] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');

  return otpSent ? (
    <Formik
      initialValues={{ otp: '' }}
      onSubmit={async ({ otp }, { setSubmitting }) => {
        try {
          setError('');
          const {
            data: { data: user },
          } = await axios.post<SuccessResponse<User>>(
            '/auth/login-subscriber/verify-otp',
            { userId, otp: String(otp) },
          );

          setUser(user);
          props.onLoginSuccess?.(user);
        } catch (error) {
          console.error(error);
          setError('Invalid OTP');
        }
        setSubmitting(false);
      }}
      validationSchema={verifyOTPSchema}
    >
      <Form>
        <ModalBody>
          {error && (
            <Alert status="error" my="6">
              <AlertIcon />
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}

          <Box>
            <Input name="otp" type="number" label="OTP" autoComplete="off" />
          </Box>
        </ModalBody>

        <ModalFooter>
          <SubmitBtn colorScheme="blue">Verify phone number</SubmitBtn>
        </ModalFooter>
      </Form>
    </Formik>
  ) : (
    <Formik
      initialValues={{ phone: '' }}
      onSubmit={async ({ phone }, { setSubmitting }) => {
        try {
          setError('');
          const { data } = await axios.post<
            SuccessResponse<{ userId: string }>
          >('/auth/login-subscriber/send-otp', {
            phoneNumber: phone,
          });

          setUserId(data.data.userId);
          setOtpSent(true);
        } catch (error) {
          console.error(error);
          setError('Unable to send OTP');
        }
        setSubmitting(false);
      }}
      validationSchema={sendOTPSchema}
    >
      <Form>
        <ModalBody>
          {error && (
            <Alert status="error" my="6">
              <AlertIcon />
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}

          <Input
            name="phone"
            type="tel"
            label="Phone number"
            leftAddon="+91"
            labelStyles={{ marginLeft: '70px' }}
          />
        </ModalBody>

        <ModalFooter>
          <SubmitBtn colorScheme="blue">Send OTP</SubmitBtn>
        </ModalFooter>
      </Form>
    </Formik>
  );
}
