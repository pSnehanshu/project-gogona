import { Box, Heading, Link } from '@chakra-ui/react';
import {
  FaFacebook,
  FaGlobeAmericas,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa';
import Avatar from './Avatar';

export default function IntroBox({ fullName }: { fullName: string }) {
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
