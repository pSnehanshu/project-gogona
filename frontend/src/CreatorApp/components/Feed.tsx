import { useFeed } from '../queries/posts';
import Post from './Post';

export default function Feed() {
  const posts = useFeed();

  return (
    <>
      {posts.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </>
  );
}
