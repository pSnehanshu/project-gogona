import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Image,
  Text,
} from '@chakra-ui/react';
import { useCallback, useContext } from 'react';
import { AiOutlineLike } from 'react-icons/ai';
import { BiCommentDots } from 'react-icons/bi';
import { IoShareOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import type { Post as PostType } from '../../types';
import type { File as FileType } from '@prisma/client';
import Avatar from './Avatar';
import { SubscriberLoginContext } from './subscriber-auth/SubscriberLogin';
import ImageKit from 'imagekit-javascript';

const imagekit = new ImageKit({
  urlEndpoint: process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT!,
});

type Media = {
  url: string;
  mime: string;
};

function MediaDisplayer({ files }: { files: FileType[] }) {
  const getMedia = useCallback(
    () =>
      files?.map(
        (file): Media => ({
          url: imagekit.url({
            path: file.link,
            transformation: [
              {
                height: '400',
              },
              {
                focus: 'auto',
                quality: '40',
              },
            ],
          }),
          mime: file.mimeType,
        }),
      ),
    [files],
  );

  const media = getMedia();
  if (media.length < 1) {
    return null;
  }

  let gridTemplateArea = '';

  if (media.length === 1) {
    gridTemplateArea = `'m0 m0' 'm0 m0'`;
  } else if (media.length === 2) {
    gridTemplateArea = `'m0 m1' 'm0 m1'`;
  } else if (media.length === 3) {
    gridTemplateArea = `'m0 m1' 'm2 m2'`;
  } else if (media.length === 4) {
    gridTemplateArea = `'m0 m1' 'm2 m3'`;
  } else {
    gridTemplateArea = `'m0 m1' 'm2 mx'`;
  }

  return (
    <Grid
      templateRows="1fr 1fr"
      templateColumns="1fr 1fr"
      templateAreas={gridTemplateArea}
    >
      {media.map((m, i) => (
        <GridItem key={m.url} area={`m${i}`} border="solid 1px #fff">
          <Button w="full" h="full" variant="unstyled">
            <Image src={m.url} w="full" h="full" objectFit="cover" />
          </Button>
        </GridItem>
      ))}
    </Grid>
  );
}

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
        {Array.isArray(post.Files) ? (
          <MediaDisplayer files={post.Files.map((f) => f.File)} />
        ) : null}
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
