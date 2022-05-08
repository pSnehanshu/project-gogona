import { Box, Link } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import type { SuccessResponse } from '../../shared/responses.type';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import { userAtom } from './store/auth';
import type { User } from './types';
import axios from './utils/axios';
import { CreatorHome, CreatorLayout } from './CreatorApp/App';
import PostPage from './CreatorApp/pages/Post';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardPosts from './pages/dashboard/Posts';
import MembershipTiers from './pages/dashboard/MebershipTiers';
import Subscribers from './pages/dashboard/Subscribers';
import Account from './pages/dashboard/Account';
import DashboardComments from './pages/dashboard/Comments';
import DashboardHome from './pages/dashboard/Dashboard';

function Index() {
  const [user] = useAtom(userAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/creator');
    } else {
      navigate('/auth/login');
    }
  }, [user, navigate]);

  return <></>;
}

function AuthLayout() {
  const [user] = useAtom(userAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        p="8"
        h="100vh"
        backgroundImage="/img/923.jpg"
        backgroundPosition="center"
        backgroundSize="cover"
        backgroundRepeat="no-repeat"
      >
        <Box
          borderWidth="1px"
          p="8"
          borderRadius="md"
          shadow="lg"
          maxW="2xl"
          w="full"
          bgColor="gray.200"
        >
          <Outlet />
        </Box>
      </Box>
      <Link
        isExternal
        href="https://www.freepik.com/vectors/comic-zoom"
        position="absolute"
        bottom="0"
        left="0"
        p="2"
        color="gray.700"
      >
        Comic zoom vector created by vector_corp - www.freepik.com
      </Link>
    </>
  );
}

function AppRouter() {
  const [, setUser] = useAtom(userAtom);
  const [isAuthDone, setIsAuthDone] = useState(false);

  useEffect(() => {
    axios
      .get<SuccessResponse<User>>('/auth/whoami')
      .then((res) => res.data?.data)
      .then((user) => setUser(user))
      .finally(() => setIsAuthDone(true));
  }, [setUser]);

  if (!isAuthDone) {
    return <></>;
  }

  return (
    <Routes>
      <Route path="/" element={<Outlet />}>
        <Route index element={<Index />} />
        <Route path="creator" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="posts" element={<DashboardPosts />} />
          <Route path="comments" element={<DashboardComments />} />
          <Route path="subscribers" element={<Subscribers />} />
          <Route path="membership-tiers" element={<MembershipTiers />} />
          <Route path="account" element={<Account />} />
        </Route>
        <Route path="auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>
        <Route path=":creatorHandle" element={<CreatorLayout />}>
          <Route index element={<CreatorHome />} />
          <Route path="post/:postId" element={<PostPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRouter;
