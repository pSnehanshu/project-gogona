import { useQuery } from 'react-query';
import axios from '../utils/axios';
import type { User, Post, Creator } from '../types';
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

export const useCreatorFeed = (creatorId?: string) =>
  useQuery(`/post/by-creator/${creatorId}`, async () => {
    if (!creatorId) {
      throw new Error('Handle not provided');
    }

    const { data } = await axios.get<SuccessResponse<Post[]>>(
      `/post/by-creator/${creatorId}`,
    );

    return data.data;
  });
