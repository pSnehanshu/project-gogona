import ImageKit from 'imagekit';

export const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PVT_KEY!,
  publicKey: process.env.REACT_APP_IMAGEKIT_PUB_KEY!,
  urlEndpoint: process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT!,
});
