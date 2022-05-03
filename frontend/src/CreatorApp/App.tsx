import {
  Routes,
  Route,
  Outlet,
  useParams,
  useNavigate,
} from 'react-router-dom';
import {
  Box,
  Image,
  Heading,
  Text,
  Button,
  IconButton,
  Link,
} from '@chakra-ui/react';
import type { ImageProps } from '@chakra-ui/react';
import { AiOutlineLike } from 'react-icons/ai';
import { IoShareOutline } from 'react-icons/io5';
import { BiCommentDots } from 'react-icons/bi';
import {
  FaYoutube,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaGlobeAmericas,
} from 'react-icons/fa';

type Props = {
  handle: string;
  fullName: string;
};

interface AvatarProps extends ImageProps {
  handle: string;
  height?: number;
}

function Avatar(props: AvatarProps) {
  const { handle } = props;
  return (
    <Image
      {...props}
      src="https://i.pinimg.com/originals/13/44/41/1344419e44b8908ffc3dc924e3f8b6bf.jpg"
      alt={handle}
      borderRadius="full"
      borderWidth={4}
      borderStyle="solid"
      borderColor="white"
    />
  );
}

type PostType = {
  text?: string;
  media?: string[];
  id: string;
  likes: number;
  comments: number;
  author: {
    fullName: string;
  };
};

const posts: PostType[] = [
  {
    text: 'Hello guys, happy to see you here, I hope you are doing good.',
    media: [
      'https://pbs.twimg.com/media/FRWRQpwakAED2i9?format=jpg&name=large',
    ],
    id: 'wefered',
    likes: 2700,
    comments: 500,
    author: {
      fullName: 'Ashish',
    },
  },
  {
    text: 'Hello guys, happy to see you here, I hope you are doing good.',
    media: [
      'https://pbs.twimg.com/media/FRWRQpwakAED2i9?format=jpg&name=large',
    ],
    id: 'rrgttyh',
    likes: 2700,
    comments: 500,
    author: {
      fullName: 'Ashish',
    },
  },
  {
    text: 'Hello guys, happy to see you here, I hope you are doing good.',
    media: [
      'https://pbs.twimg.com/media/FRWRQpwakAED2i9?format=jpg&name=large',
    ],
    id: 'rgtre',
    likes: 2700,
    comments: 500,
    author: {
      fullName: 'Ashish',
    },
  },
  {
    text: 'Hello guys, happy to see you here, I hope you are doing good.',
    media: [
      'https://pbs.twimg.com/media/FRWRQpwakAED2i9?format=jpg&name=large',
    ],
    id: '56ythg',
    likes: 2700,
    comments: 500,
    author: {
      fullName: 'Ashish',
    },
  },
];

function Post({ post }: { post: PostType }) {
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
            navigate(`/post/${post.id}`);
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

function IntroBox({ fullName }: { fullName: string }) {
  return (
    <>
      <Box
        h="25vh"
        w="full"
        bgImage="https://i.ytimg.com/vi/f0DBhVeLTOk/maxresdefault.jpg"
        bgPosition="center"
        bgRepeat="no-repeat"
        bgSize="cover"
      />
      <Box pos="relative" top={-110} mb={-100}>
        <Avatar handle={fullName} h={200} mx="auto" />
      </Box>
      <Box textAlign="center">
        <Heading as="h1">{fullName}</Heading>
        <Heading as="h2" size="sm" fontWeight="normal">
          Youtuber, comedian, creator, influencer
        </Heading>
      </Box>
      <Box display="flex" justifyContent="center" pt={4}>
        <Link
          href="https://www.youtube.com"
          color="#c4302b"
          fontSize={24}
          isExternal
          mx={2}
        >
          <FaYoutube />
        </Link>
        <Link
          href="https://facebook.com"
          color="facebook.500"
          fontSize={24}
          isExternal
          mx={2}
        >
          <FaFacebook />
        </Link>
        <Link
          href="https://instagram.com"
          color="#8a3ab9"
          fontSize={24}
          isExternal
          mx={2}
        >
          <FaInstagram />
        </Link>
        <Link
          href="https://twitter.com"
          isExternal
          color="twitter.500"
          fontSize={24}
          mx={2}
        >
          <FaTwitter />
        </Link>
        <Link
          href="https://ashishchanchlani.com"
          color="gray.500"
          fontSize={24}
          isExternal
          mx={2}
        >
          <FaGlobeAmericas />
        </Link>
      </Box>
    </>
  );
}

function Feed({ handle, fullName }: Props) {
  return (
    <>
      {posts.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </>
  );
}

function PostPage() {
  const { postId } = useParams();

  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return <Text>Post not found</Text>;
  }

  return (
    <>
      <Post post={post} />
    </>
  );
}

function CreatorHome({ handle, fullName }: Props) {
  return (
    <>
      <Box bg="#fff" pb={8}>
        <IntroBox fullName={fullName} />
      </Box>

      <Box>
        <Feed handle={handle} fullName={fullName} />
      </Box>
    </>
  );
}

function CreatorApp() {
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
      <Route path="/" element={<CreatorApp />}>
        <Route
          index
          element={<CreatorHome fullName={fullName} handle={handle} />}
        />
        <Route path="post/:postId" element={<PostPage />} />
      </Route>
    </Routes>
  );
}
