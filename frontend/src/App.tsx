import { Box, Heading, Link } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { Outlet, Route, Routes } from 'react-router-dom';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import { userAtom } from './store/auth';

function AppLayout() {
  const [user] = useAtom(userAtom);
  return <Box>{user && <Heading>Welcome back {user.name}</Heading>}</Box>;
}

function AuthLayout() {
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
  return (
    <Routes>
      <Route path="/" element={<Outlet />}>
        <Route index element={<AppLayout />} />
        <Route path="auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRouter;
