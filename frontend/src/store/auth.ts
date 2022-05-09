import { atom, useAtom } from 'jotai';
import type { User } from '../types';

export const userAtom = atom<User | null>(null);

export const useSubscriberUser = () => {
  const [user] = useAtom(userAtom);
  if (!user) return null;
  if (!user.Subscriber) return null;
  return user;
};
