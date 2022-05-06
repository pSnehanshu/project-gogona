import { Outlet, useParams } from 'react-router-dom';
import { Box, Heading } from '@chakra-ui/react';
import IntroBox from './components/IntroBox';
import Feed from './components/Feed';
import { useCreator } from '../store/creator';

export function CreatorHome() {
  const { creatorHandle } = useParams();
  const { data: creator, isLoading, isError } = useCreator(creatorHandle);

  if (isLoading) {
    return <Heading>Loading...</Heading>;
  }

  if (isError) {
    return <Heading>Error</Heading>;
  }

  return (
    <>
      <Box bg="#fff" pb={8}>
        <IntroBox fullName={creator?.User.name!} />
      </Box>

      <Box>
        <Feed creatorId={creator?.id!} />
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
