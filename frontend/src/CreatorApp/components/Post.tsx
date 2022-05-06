import {
  Box,
  Button,
  Heading,
  IconButton,
  Image,
  Text,
} from '@chakra-ui/react';
import { AiOutlineLike } from 'react-icons/ai';
import { BiCommentDots } from 'react-icons/bi';
import { IoShareOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import Avatar from './Avatar';

export type PostType = {
  text?: string;
  media?: string[];
  id: string;
  likes: number;
  comments: number;
  author: {
    fullName: string;
  };
};

export default function Post({ post }: { post: PostType }) {
  const navigate = useNavigate();

  return (
    <Box bg="#fff" mt={4}>
      <Box display="flex" alignItems="center" p={2}>
        <Avatar handle={post.author.fullName} h={20} mr="4" />
        <Heading as="h2" size="md">
          {post.author.fullName}
        </Heading>
      </Box>
      <Box>
        <Text p={4}>{post.text}</Text>
        <Image src={post.media?.[0]} w="full" />
      </Box>
      <Box display="flex" justifyContent="space-around" py={4} px={2}>
        <Button
          color="gray.600"
          size="md"
          variant="ghost"
          leftIcon={<AiOutlineLike style={{ fontSize: '20px' }} />}
        >
          {post.likes}
        </Button>
        <Button
          color="gray.600"
          size="md"
          variant="ghost"
          leftIcon={<BiCommentDots style={{ fontSize: '20px' }} />}
          onClick={() => {
            navigate(`post/${post.id}`);
          }}
        >
          {post.comments}
        </Button>
        <IconButton
          color="gray.600"
          aria-label="Share"
          size="md"
          variant="ghost"
          icon={<IoShareOutline style={{ fontSize: '20px' }} />}
        />
      </Box>
    </Box>
  );
}
