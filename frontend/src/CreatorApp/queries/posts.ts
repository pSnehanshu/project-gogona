// import type { PostType } from '../components/Post';

const posts: any[] = [
  {
    text: 'Hello guys, happy to see you here, I hope you are doing good.',
    media: [
      'https://pbs.twimg.com/media/FRWRQpwakAED2i9?format=jpg&name=large',
    ],
    id: 'wefered',
    likes: 2700,
    comments: 500,
    author: {
      fullName: 'Ashish',
    },
  },
  {
    text: 'Hello guys, happy to see you here, I hope you are doing good.',
    media: [
      'https://pbs.twimg.com/media/FRWRQpwakAED2i9?format=jpg&name=large',
    ],
    id: 'rrgttyh',
    likes: 2700,
    comments: 500,
    author: {
      fullName: 'Ashish',
    },
  },
  {
    text: 'Hello guys, happy to see you here, I hope you are doing good.',
    media: [
      'https://pbs.twimg.com/media/FRWRQpwakAED2i9?format=jpg&name=large',
    ],
    id: 'rgtre',
    likes: 2700,
    comments: 500,
    author: {
      fullName: 'Ashish',
    },
  },
  {
    text: 'Hello guys, happy to see you here, I hope you are doing good.',
    media: [
      'https://pbs.twimg.com/media/FRWRQpwakAED2i9?format=jpg&name=large',
    ],
    id: '56ythg',
    likes: 2700,
    comments: 500,
    author: {
      fullName: 'Ashish',
    },
  },
];

type CommentType = {
  postId: string;
  id: string;
  author: {
    fullName: string;
  };
  text: string;
  replyTo: string | null;
};

const comments: CommentType[] = [
  {
    id: 'wergt4regt',
    postId: 'wefered',
    author: {
      fullName: 'Chaman',
    },
    replyTo: null,
    text: 'Nice :)',
  },
  {
    id: '2343wed',
    postId: 'wefered',
    author: {
      fullName: 'Gagan',
    },
    replyTo: null,
    text: 'Wow',
  },
];

export function useFeed() {
  return posts;
}

export function usePost(id?: string) {
  return posts.find((p) => p.id === id);
}

export function useComments(postId?: string) {
  return comments.filter((c) => c.postId === postId);
}
