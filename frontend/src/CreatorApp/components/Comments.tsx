import { Box } from '@chakra-ui/react';
import { useComments } from '../queries/posts';

export default function Comments({ postId }: { postId: string }) {
  const comments = useComments(postId);
  return (
    <Box>
      {comments.map((comment) => (
        <Box>
          {comment.author.fullName}: {comment.text}
        </Box>
      ))}
    </Box>
  );
}
