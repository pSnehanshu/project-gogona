import { Routes, Route, Outlet } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import PostPage from './pages/Post';
import IntroBox from './components/IntroBox';
import Feed from './components/Feed';

type Props = {
  handle: string;
  fullName: string;
};

function CreatorHome({ handle, fullName }: Props) {
  return (
    <>
      <Box bg="#fff" pb={8}>
        <IntroBox fullName={fullName} />
      </Box>

      <Box>
        <Feed />
      </Box>
    </>
  );
}

function CreatorLayout() {
  return (
    <Box bg="#000">
      <Box maxW={500} minH="100vh" mx="auto" overflowX="hidden" bg="#d3d3d3">
        <Outlet />
      </Box>
    </Box>
  );
}

export default function CreatorRouter({ handle, fullName }: Props) {
  return (
    <Routes>
      <Route path="/" element={<CreatorLayout />}>
        <Route
          index
          element={<CreatorHome fullName={fullName} handle={handle} />}
        />
        <Route path="post/:postId" element={<PostPage />} />
      </Route>
    </Routes>
  );
}
