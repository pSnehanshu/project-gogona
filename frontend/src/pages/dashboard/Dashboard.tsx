import {
  Box,
  Flex,
  Heading,
  Link,
  Tooltip,
  useClipboard,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { userAtom } from '../../store/auth';
import { FiCopy, FiCheck } from 'react-icons/fi';

export default function DashboardHome() {
  const [user] = useAtom(userAtom);
  const creatorHomeLink = `${window.location.protocol}//${window.location.host}/${user?.Creator?.handle}`;
  const { hasCopied, onCopy } = useClipboard(creatorHomeLink);

  return (
    <Box>
      <Heading>Welcome {user?.name}</Heading>

      <Flex mb={2}>
        <Link href={creatorHomeLink} isExternal color="twitter.700" my="2">
          {window.location.host}/{user?.Creator?.handle}
        </Link>

        <Tooltip label="Copy link">
          <button
            onClick={onCopy}
            aria-label="Copy"
            style={{ marginLeft: '6px', borderWidth: '0px' }}
          >
            {hasCopied ? <FiCheck /> : <FiCopy />}
          </button>
        </Tooltip>
      </Flex>
    </Box>
  );
}
