import { useAtom } from 'jotai';
import { useEffect, ReactText } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { userAtom } from '../../store/auth';
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
} from '@chakra-ui/react';
import { FiTrendingUp, FiMenu, FiUsers, FiPower } from 'react-icons/fi';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { GoDashboard, GoCommentDiscussion } from 'react-icons/go';
import { MdManageAccounts } from 'react-icons/md';
import type { IconType } from 'react-icons';
import axios from '../../utils/axios';

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Subscrew
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} link={link.link}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
  link: string | (() => void);
}
const NavItem = ({ icon, children, link, ...rest }: NavItemProps) => {
  return (
    <Link
      to={typeof link === 'string' ? link : '#'}
      onClick={() => {
        if (typeof link === 'function') {
          link();
        }
      }}
      style={{ textDecoration: 'none' }}
      // _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
        Subscrew
      </Text>
    </Flex>
  );
};

interface LinkItemProps {
  name: string;
  icon: IconType;
  link: string | (() => void);
}
const LinkItems: Array<LinkItemProps> = [
  { name: 'Dashboard', icon: GoDashboard, link: '' },
  { name: 'Posts', icon: HiOutlineDocumentText, link: 'posts' },
  { name: 'Comments', icon: GoCommentDiscussion, link: 'comments' },
  { name: 'Subscribers', icon: FiUsers, link: 'subscribers' },
  { name: 'Membership Tiers', icon: FiTrendingUp, link: 'membership-tiers' },
  { name: 'My Account', icon: MdManageAccounts, link: 'account' },
  {
    name: 'Logout',
    icon: FiPower,
    link: async () => {
      await axios.delete('/auth');
      window.location.reload();
    },
  },
];

export default function Dashboard() {
  const [user] = useAtom(userAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    }
  }, [user, navigate]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Outlet />
      </Box>
    </Box>
  );
}
