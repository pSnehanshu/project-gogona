import { Heading, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import Comments from '../components/Comments';
import Post from '../components/Post';
import { usePost } from '../../store/post';

export default function PostPage() {
  const { postId } = useParams();
  const { data: post, isLoading, isError } = usePost(postId);

  if (isLoading) {
    return <Heading>Loading...</Heading>;
  }

  if (isError) {
    return <Heading>Failed to load post</Heading>;
  }

  if (!post) {
    return <Text>Post not found</Text>;
  }

  return (
    <>
      <Post post={post} />
      <Comments postId={post.id} />
    </>
  );
}
