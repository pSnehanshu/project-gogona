import { Box, Heading } from '@chakra-ui/react';
import DataTable from 'react-data-table-component';
import type { TableColumn } from 'react-data-table-component';
import { Post } from '../../types';
import { useCreatorFeed } from '../../store/creator';
import { useAtom } from 'jotai';
import { userAtom } from '../../store/auth';
import { useState } from 'react';

const columns: TableColumn<Post>[] = [
  {
    name: 'ID',
    selector: (row) => row.id,
  },
  {
    name: 'Text',
    selector: (row) => row.text,
  },
];

export default function Posts() {
  const [user] = useAtom(userAtom);
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(20);
  const { data, isLoading, isError } = useCreatorFeed(
    user?.Creator?.id,
    skip,
    take,
  );

  if (isError) return <Heading>Error</Heading>;

  const { posts, total } = data ?? {};

  return (
    <Box>
      <DataTable
        title="Posts"
        columns={columns}
        data={posts ?? []}
        paginationPerPage={take}
        progressPending={isLoading}
        pagination
        paginationServer
        paginationTotalRows={total}
        onChangeRowsPerPage={(newPerPage) => {
          setTake(newPerPage);
        }}
        onChangePage={(page) => {
          setSkip((page - 1) * take);
        }}
      />
    </Box>
  );
}
