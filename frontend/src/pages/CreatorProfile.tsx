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

const posts = [{}, {}, {}, {}];

export default function CreatorProfile({ handle, fullName }: Props) {
  return (
    <Box>
      <Box bg="#fff" pb={8}>
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
      </Box>

      <Box>
        {posts.map(() => (
          <Box bg="#fff" mt={4}>
            <Box display="flex" alignItems="center" p={2}>
              <Avatar handle={fullName} h={20} mr="4" />
              <Heading as="h2" size="md">
                {fullName}
              </Heading>
            </Box>
            <Box>
              <Text p={4}>
                Hello guys, happy to see you here, I hope you are doing good.
              </Text>
              <Image
                src="https://pbs.twimg.com/media/FRWRQpwakAED2i9?format=jpg&amp;name=large"
                w="full"
              />
            </Box>
            <Box display="flex" justifyContent="space-around" py={4} px={2}>
              <Button
                color="gray.600"
                size="md"
                variant="ghost"
                leftIcon={<AiOutlineLike style={{ fontSize: '20px' }} />}
              >
                2.7K
              </Button>
              <Button
                color="gray.600"
                size="md"
                variant="ghost"
                leftIcon={<BiCommentDots style={{ fontSize: '20px' }} />}
              >
                500
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
        ))}
      </Box>
    </Box>
  );
}
