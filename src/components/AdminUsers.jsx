import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, TextInput, PasswordInput, Space, Center, Checkbox } from '@mantine/core';

import User from './User';
import Loading from './Loading';
import { loadUsers, createUser } from '../redux/slices/adminSlice';

export default function AdminUsers() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.admin) || {};
  const [opened, { open, close }] = useDisclosure(false);
  const [visible, { toggle }] = useDisclosure(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isStaff, setIsStaff] = useState(false);

  const handleCreateUser = () => {
    dispatch(createUser({ username: newUsername, password: newPassword, is_staff: isStaff }))
      .then(() => dispatch(loadUsers()));
    close();
  };

  useEffect(() => {
    dispatch(loadUsers());
  }, [dispatch]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : error ? (
        <div>Ошибка: {error}</div>
      ) : (
        <Container>
          <Center inline style={{ gap: '20px' }}>
            <h2>Пользователи</h2>
            <Button variant='light' onClick={open}>Создать нового пользователя</Button>
          </Center>

          {users && users.map((user) => (
            <User key={user.id} user={user} />
          ))}
        </Container>
      )}

      <Modal opened={opened} onClose={close} title="Создать пользователя" centered>
        <TextInput
          label="Имя пользователя"
          placeholder="Введите имя пользователя"
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <PasswordInput
          label="Пароль"
          placeholder='Введите пароль'
          visible={visible}
          onVisibilityChange={toggle}
          onChange={(e) => setNewPassword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleCreateUser()}
        />
        <Space h="md" />
        <Checkbox
          defaultChecked={false}
          label="Предоставить права администратора"
          onChange={(e) => setIsStaff(e.target.checked)}
        />
        <Space h="md" />
        <Center>
          <Button onClick={handleCreateUser}>Создать пользователя</Button>
        </Center>
      </Modal>
    </>
  );
}
