import { Outlet } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import IntroBox from './components/IntroBox';
import Feed from './components/Feed';

type Props = {
  handle: string;
  fullName: string;
};

export function CreatorHome({ handle, fullName }: Props) {
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

export function CreatorLayout() {
  return (
    <Box bg="#000">
      <Box maxW={500} minH="100vh" mx="auto" overflowX="hidden" bg="#d3d3d3">
        <Outlet />
      </Box>
    </Box>
  );
}
