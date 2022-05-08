import { useQuery } from 'react-query';
import axios from '../utils/axios';
import type { Post, Creator } from '../types';
import { SuccessResponse } from '../../../shared/responses.type';

export const useCreator = (handle?: string) =>
  useQuery(`/creator/${handle}`, async () => {
    if (!handle) {
      throw new Error('Handle not provided');
    }

    const { data } = await axios.get<SuccessResponse<Creator>>(
      `/creator/${handle}`,
    );

    return data.data;
  });

export const useCreatorFeed = (creatorId?: string, skip = 0, take = 20) =>
  useQuery(
    ['/post/by-creator', creatorId, skip, take],
    async () => {
      if (!creatorId) {
        throw new Error('Handle not provided');
      }

      const { data } = await axios.get<
        SuccessResponse<{ posts: Post[]; total: number }>
      >(`/post/by-creator/${creatorId}?take=${take}&skip=${skip}`);

      return data.data;
    },
    { keepPreviousData: true },
  );
