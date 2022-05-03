import { Image } from '@chakra-ui/react';
import type { ImageProps } from '@chakra-ui/react';

interface AvatarProps extends ImageProps {
  handle: string;
  height?: number;
}

export default function Avatar(props: AvatarProps) {
  const { handle } = props;
  return (
    <Image
      {...props}
      src="https://i.pinimg.com/originals/13/44/41/1344419e44b8908ffc3dc924e3f8b6bf.jpg"
      alt={handle}
      borderRadius="full"
      borderWidth={4}
      borderStyle="solid"
      borderColor="white"
    />
  );
}
