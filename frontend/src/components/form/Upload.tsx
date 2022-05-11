import { useFormikContext } from 'formik';
import type { FieldAttributes } from 'formik';
import { useDropzone } from 'react-dropzone';
import { useMemo, useState } from 'react';
import { Box, IconButton, Image, Tooltip } from '@chakra-ui/react';
import { IoCloseCircleSharp } from 'react-icons/io5';
import { memoize } from 'lodash-es';

const baseStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#999',
  borderStyle: 'dashed',
  backgroundColor: '#eaeaea',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
  minHeight: '200px',
};

const focusedStyle: React.CSSProperties = {
  borderColor: '#2196f3',
};

const acceptStyle: React.CSSProperties = {
  borderColor: '#00e676',
};

const rejectStyle: React.CSSProperties = {
  borderColor: '#ff1744',
};

const createObjectURL = memoize((file: File) => URL.createObjectURL(file));
const maxFiles = 500;

export default function Upload(props: FieldAttributes<unknown>) {
  const [files, setFiles] = useState<File[]>([]);
  const { setFieldValue } = useFormikContext();
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: {
      'image/*': [],
    },
    maxFiles,
    multiple: true,
    onDrop(acceptedFiles) {
      const allFiles = files.concat(acceptedFiles);
      setFieldValue(props.name, allFiles);
      setFiles(allFiles);
    },
  });
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject],
  );

  return (
    <div>
      {files.length < maxFiles ? (
        <div {...getRootProps({ style })}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </div>
      ) : null}

      {/* File previews */}
      <Box minH="100px" mt="4">
        {files.map((file, i) => (
          <Box
            h="100px"
            w="100px"
            mr="2"
            display="inline-block"
            borderRadius="lg"
            overflow="hidden"
            border="solid 1px gray"
            pos="relative"
            key={file.name + i}
          >
            <Image
              src={createObjectURL(file)}
              h="full"
              w="full"
              objectFit="cover"
            />

            <Tooltip label="Remove" hasArrow placement="top">
              <IconButton
                aria-label="remove"
                icon={<IoCloseCircleSharp />}
                pos="absolute"
                top="0"
                right="0"
                size="xs"
                bg="transparent"
                fontSize="lg"
                _hover={{
                  color: 'red.500',
                }}
                onClick={(e) => {
                  setFiles((files) => {
                    const allFiles = [...files];
                    allFiles.splice(i, 1);
                    return allFiles;
                  });
                  e.stopPropagation();
                }}
              />
            </Tooltip>
          </Box>
        ))}
      </Box>
    </div>
  );
}
