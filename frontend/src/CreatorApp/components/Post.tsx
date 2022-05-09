import {
  Box,
  Button,
  Heading,
  IconButton,
  Image,
  Text,
} from '@chakra-ui/react';
import { useContext } from 'react';
import { AiOutlineLike } from 'react-icons/ai';
import { BiCommentDots } from 'react-icons/bi';
import { IoShareOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { Post as PostType } from '../../types';
import Avatar from './Avatar';
import { SubscriberLoginContext } from './subscriber-auth/SubscriberLogin';

export default function Post({ post }: { post: PostType }) {
  const navigate = useNavigate();
  const requireLogin = useContext(SubscriberLoginContext);

  return (
    <Box bg="#fff" mt={4}>
      <Box display="flex" alignItems="center" p={2}>
        <Avatar handle={post.Creator.User.name} h={20} mr="4" />
        <Heading as="h2" size="md">
          {post.Creator.User.name}
        </Heading>
      </Box>
      <Box>
        <Box p={4}>
          {post.text.split('\n').map((para: string, i: number) => (
            <Text key={`${i}-${para}`}>{para.trim()}</Text>
          ))}
        </Box>
        <Image src={post.Files?.[0]?.File?.link} w="full" />
      </Box>
      <Box display="flex" justifyContent="space-around" py={4} px={2}>
        <Button
          color="gray.600"
          size="md"
          variant="ghost"
          leftIcon={<AiOutlineLike style={{ fontSize: '20px' }} />}
          onClick={() => {
            if (requireLogin) {
              requireLogin()
                .then(() => {
                  // Like
                })
                .catch(() => null);
            }
          }}
        >
          {0}
        </Button>
        <Button
          color="gray.600"
          size="md"
          variant="ghost"
          leftIcon={<BiCommentDots style={{ fontSize: '20px' }} />}
          onClick={() => {
            if (requireLogin) {
              requireLogin()
                .then(() => navigate(`post/${post.id}`))
                .catch(() => null);
            }
          }}
        >
          {0}
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
