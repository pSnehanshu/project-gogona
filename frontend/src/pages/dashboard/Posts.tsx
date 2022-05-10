import {
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import DataTable from 'react-data-table-component';
import type { TableColumn } from 'react-data-table-component';
import type { Post } from '../../types';
import { useCreatorFeed } from '../../store/creator';
import { useAtom } from 'jotai';
import { userAtom } from '../../store/auth';
import { useState } from 'react';
import { formatDate } from '../../utils/date';
import { BiEdit } from 'react-icons/bi';
import { Form, Formik } from 'formik';
import Input from '../../components/form/Input';
import axios from '../../utils/axios';
import SubmitBtn from '../../components/form/SubmitBtn';
import { useQueryClient } from 'react-query';

const initialValues: {
  text: string;
  files?: FileList;
} = { text: '', files: undefined };

function CreatePost({
  disclosure,
  onCreate,
}: {
  disclosure: ReturnType<typeof useDisclosure>;
  onCreate?: (post: Post) => void;
}) {
  return (
    <Modal size="2xl" isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create new post</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={initialValues}
          onSubmit={async ({ text, files }, { setSubmitting }) => {
            try {
              // Prepare FormData
              const data2send = new FormData();
              data2send.append('text', text);

              // If files were selected, append them
              if (files) {
                Array.from(files).forEach((file) => {
                  data2send.append('files', file);
                });
              }

              // Submit to backend
              const { data: post } = await axios.post<Post>(
                '/post',
                data2send,
                {
                  headers: {
                    'content-type': 'multipart/form-data',
                  },
                },
              );

              onCreate?.(post);
            } catch (error) {
              console.error(error);
            }
            setSubmitting(false);
          }}
        >
          {({ setFieldValue }) => (
            <Form>
              <ModalBody>
                <Input name="text" type="textarea" label="Write your post" />

                <input
                  type="file"
                  name="files"
                  multiple
                  onChange={(event) => {
                    setFieldValue('files', event.currentTarget.files);
                  }}
                />
              </ModalBody>

              <ModalFooter>
                <SubmitBtn colorScheme="blue">Create post</SubmitBtn>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
}

const columns: TableColumn<Post>[] = [
  {
    name: 'Created on',
    selector: (row) => formatDate(row.createdAt),
  },
  {
    name: 'Text',
    selector: (row) => row.text,
  },
];

export default function Posts() {
  const [user] = useAtom(userAtom);
  const queryClient = useQueryClient();
  const createPostModal = useDisclosure();
  const [page, setPage] = useState(1);
  const [perPageCount, setPerPageCount] = useState(20);
  const { data, isLoading, isError } = useCreatorFeed(
    user?.Creator?.id,
    (page - 1) * perPageCount,
    perPageCount,
  );

  if (isError) return <Heading>Error</Heading>;

  const { posts = [], total = 0 } = data ?? {};

  return (
    <Box>
      <DataTable
        title={
          <Flex justifyContent="space-between">
            <Heading m="4">Posts</Heading>
            <Button
              m="4"
              leftIcon={<BiEdit />}
              colorScheme="blue"
              onClick={createPostModal.onOpen}
            >
              Create new post
            </Button>
          </Flex>
        }
        columns={columns}
        data={posts}
        highlightOnHover
        paginationPerPage={perPageCount}
        progressPending={isLoading}
        pagination
        paginationServer
        paginationTotalRows={total}
        onChangeRowsPerPage={(newPerPage) => setPerPageCount(newPerPage)}
        onChangePage={(page) => setPage(page)}
      />

      <CreatePost
        disclosure={createPostModal}
        onCreate={(post) => {
          queryClient.invalidateQueries('/post/by-creator');
          createPostModal.onClose();
        }}
      />
    </Box>
  );
}
