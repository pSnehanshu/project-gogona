import { Heading } from '@chakra-ui/react';
import { useCreatorFeed } from '../../store/creator';
import Post from './Post';

export default function Feed({ creatorId }: { creatorId: string }) {
  const { data: posts, isLoading, isError } = useCreatorFeed(creatorId);

  if (isLoading) {
    return <Heading>Loading...</Heading>;
  }

  if (isError) {
    return <Heading>Error</Heading>;
  }

  return (
    <>
      {posts!.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </>
  );
}
