import { Outlet, useParams } from 'react-router-dom';
import {
  Box,
  Heading,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import IntroBox from './components/IntroBox';
import Feed from './components/Feed';
import { useCreator } from '../store/creator';
import SubscriberLogin, {
  SubscriberLoginContext,
} from './components/subscriber-auth/SubscriberLogin';
import { useSubscriberUser } from '../store/auth';
import { useState } from 'react';
import { User } from '../types';

export function CreatorHome() {
  const { creatorHandle } = useParams();
  const { data: creator, isLoading, isError } = useCreator(creatorHandle);

  if (isLoading) {
    return <Heading>Loading...</Heading>;
  }

  if (isError) {
    return <Heading>Error</Heading>;
  }

  return (
    <>
      <Box bg="#fff" pb={8}>
        <IntroBox fullName={creator?.User.name!} />
      </Box>

      <Box>
        <Feed creatorId={creator?.id!} />
      </Box>
    </>
  );
}

export function CreatorLayout() {
  const [promiseFillers, setPromiseFillers] = useState<{
    resolve?: (user: User) => void;
    reject?: () => void;
  }>({});
  const subscriberLoginDisclosure = useDisclosure();
  const user = useSubscriberUser();

  return (
    <Box bg="#000">
      <Box maxW={500} minH="100vh" mx="auto" overflowX="hidden" bg="#d3d3d3">
        <SubscriberLoginContext.Provider
          value={() => {
            return new Promise<User>((resolve, reject) => {
              if (user) {
                resolve(user);
              } else {
                setPromiseFillers({
                  reject,
                  resolve,
                });
                subscriberLoginDisclosure.onOpen();
              }
            }).finally(() => setPromiseFillers({}));
          }}
        >
          <Outlet />
        </SubscriberLoginContext.Provider>
      </Box>

      <Modal
        size="2xl"
        isCentered
        isOpen={subscriberLoginDisclosure.isOpen}
        onClose={() => {
          subscriberLoginDisclosure.onClose();
          promiseFillers.reject?.();
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Login to continue</ModalHeader>
          <ModalCloseButton />
          <SubscriberLogin
            onLoginSuccess={(user) => {
              subscriberLoginDisclosure.onClose();
              promiseFillers.resolve?.(user);
            }}
          />
        </ModalContent>
      </Modal>
    </Box>
  );
}
