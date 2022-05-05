import { Box } from '@chakra-ui/react';
import { Outlet, Route, Routes } from 'react-router-dom';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

function AppLayout() {
  return <Box></Box>;
}

function AuthLayout() {
  return (
    <Box>
      <Outlet />
    </Box>
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
