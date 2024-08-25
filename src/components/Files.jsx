import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect, useState, useRef } from 'react';

import { IconUpload } from '@tabler/icons-react';
import { Container, FileInput, Button, Space, TextInput, Center, Group } from '@mantine/core';

import File from './File';
import Loading from './Loading';
import { uploadFile, loadFiles, initialFileState } from '../redux/slices/fileSlice';
import { loadUsers } from '../redux/slices/adminSlice';

export default function Files() {
  const { files, loading } = useSelector((state) => state.file) || initialFileState;
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [filename, setFilename] = useState('');
  const [description, setDescription] = useState('');

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      if (filename === '') {
        setFilename(selectedFile.name);
      }

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('filename', filename);
      formData.append('description', description);
      formData.append('uploaded_by', JSON.parse(sessionStorage.getItem('user')).id);
      dispatch(uploadFile(formData))
        .then(() => {
          dispatch(loadFiles());
          setSelectedFile(null);
        })
        .catch((error) => {
          console.error('Ошибка загрузки файла:', error);
        });
      setFilename('');
      setDescription('');
    }
  };

  useEffect(() => {
    dispatch(loadFiles());
    dispatch(loadUsers());
    setSelectedFile(null);
    setFilename('');
  }, [dispatch]);

  return (
    <>
      <Space h="lg" />
      <Container bg="white" style={{ padding: '20px 40px', borderRadius: '8px', width: '90%', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <input
          type="file"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileInputChange}
        />
        <TextInput
          label="Имя файла"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
        />
        <Space h="xs" />
        <TextInput
          label="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Space h="md" />
        <Group>
          <FileInput
            size='md'
            onClick={() => fileInputRef.current.click()}
            placeholder={selectedFile ? selectedFile.name : 'Выберите файлы'}
            variant="default"
            style={{ borderRadius: '3px', flex: '1' }}
          />
          <Button
            variant="light"
            size="md"
            onClick={() => fileInputRef.current.click()}
          >
            Выберите файлы
          </Button>
        </Group>
        <Space h="lg" />
        <Center>
          <Button
            rightSection={<IconUpload size={16} />}
            variant="light"
            size="md"
            onClick={handleUpload}
          >
            Загрузить
          </Button>
        </Center>
      </Container>
      <Space h="xs" />

      {Array.isArray(files) && files.length > 0 ? (
        files.map((file) => {
          if (file.uploaded_by === JSON.parse(sessionStorage.getItem('user')).username) {
            return (
              <>
                <Container bg="white" style={{ borderRadius: '8px', width: '90%', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                  <File key={file.id} file={file} />
                </Container>
                <Space h="xs" />
              </>
            );
          } else {
            return null;
          }
        })
      ) : null}

      <Container>
        {loading && <Loading />}
      </Container>
    </>
  );
}