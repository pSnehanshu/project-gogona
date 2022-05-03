import { Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import Comments from '../components/Comments';
import Post from '../components/Post';
import { usePost } from '../queries/posts';

export default function PostPage() {
  const { postId } = useParams();

  const post = usePost(postId);

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
