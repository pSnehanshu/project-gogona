import { User } from '@prisma/client';
import prisma from '../prisma';
import * as _ from 'lodash';
import { differenceInSeconds } from 'date-fns';

export function safeToTransmitUser(
  user: User,
): Omit<User, 'password' | 'createdAt' | 'updatedAt'> {
  return _.omit(user, ['password', 'createdAt', 'updatedAt']);
}

/**
 * Function to generate OTP
 * @param length Length of OTP, default 5
 * @returns OTP as string
 */
function generateOTP(length = 5) {
  // Declare a digits variable
  // which stores all digits
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

export async function sendOtp(userId: string) {
  const otp = generateOTP(5);
  const sms = `Your OTP for Subscrew is ${otp}. Don't share this with anyone.`;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('Unable to send OTP, User does not exists');
  }

  if (!user.phoneNumber) {
    throw new Error('Unable to send OTP, User does not have phone number');
  }

  await prisma.user.update({
    data: { otp, otpCreatedOn: new Date() },
    where: { id: user.id },
  });

  console.log('OTP sent', user?.phoneNumber, sms);

  return otp;
}

export async function verifyOtp(userId: string, otp: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (user?.otp !== otp) {
    return false;
  }

  if (user.otpCreatedOn instanceof Date) {
    const secOld = differenceInSeconds(new Date(), user.otpCreatedOn);

    // Remove used otp
    await prisma.user.update({
      where: { id: user.id },
      data: {
        otp: null,
        otpCreatedOn: null,
      },
    });

    return secOld < 10 * 60; // 10 mins
  }

  return true;
}
