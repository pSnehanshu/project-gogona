import axios from '../utils/axios';
import { useQuery } from 'react-query';
import { SuccessResponse } from '../../../shared/responses.type';
import type { Post } from '../types';

export const usePost = (id?: string) =>
  useQuery(['post', id], async () => {
    if (!id) return null;

    const {
      data: { data: post },
    } = await axios.get<SuccessResponse<Post>>(`/post/${id}`);

    return post;
  });
