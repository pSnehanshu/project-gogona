import { atom, useAtom } from 'jotai';
import type { User } from '../types';
import axios from '../utils/axios';

export const userAtom = atom<User | null>(null);

export const useLogout = () => {
  const [, setUser] = useAtom(userAtom);

  async function logout() {
    await axios.delete('/auth');
    setUser(null);
  }

  return logout;
};
