import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Text, Menu, Avatar, Group } from '@mantine/core';

import { checkUser, logout } from '../redux/slices/authSlice';

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    dispatch(logout());
    navigate('/login');
  };

  useEffect(() => {
    dispatch(checkUser());
  }, [dispatch]);

  return (
<Container fluid h={50} bg="white" style={{ padding: '20px 30px', marginBottom: '50px', marginTop: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', display: 'flex', alignItems: 'center' }}>
  <Group justify='space-between' style={{ width: '100%' }}>
        <Group justify='flex-start'>
          <Text size='xl'>Файловый менеджер</Text>
        </Group>

        {user ? (
          <Group>
            <Button variant='light' size="md" onClick={() => navigate('/')}>Мои файлы</Button>
            <Menu trigger="hover" openDelay={100} closeDelay={400}>
              <Menu.Target>
                <Button size="md"><Avatar radius="xl" size="md" variant="transparent" />{user.username}</Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Настройки</Menu.Label>
                <Menu.Item color='red' onClick={handleLogout}>Выйти</Menu.Item>
                {user.is_staff && (
                  <>
                    <Menu.Divider />
                    <Menu.Label>Панель администратора</Menu.Label>
                    <Menu.Item onClick={() => navigate('/admin/files')}>Управление файлами</Menu.Item>
                    <Menu.Item onClick={() => navigate('/admin/users')}>Управление пользователями</Menu.Item>
                  </>
                )}
              </Menu.Dropdown>
            </Menu>
          </Group>
        ) : (
          <Button size="md" onClick={() => navigate('/login')}>Войти</Button>
        )}
      </Group>
    </Container>
  );
}
