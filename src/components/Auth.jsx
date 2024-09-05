import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Center, TextInput, PasswordInput, Space, Button, Anchor } from '@mantine/core';
import { login, signUp } from '../redux/slices/authSlice';


const apiUrl = process.env.REACT_APP_API_URL;


function Auth({ action }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const dispatch = useDispatch();

  const validateUsername = (username) => /^[a-zA-Z][a-zA-Z0-9]{3,19}$/.test(username);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+.[^\s@]+$/.test(email);
  const validatePassword = (password) => /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(password);

  const handleLogin = async () => {
    const response = await dispatch(login({ username, password }));
    if (login.fulfilled.match(response)) {
      navigate('/');
    } else {
      setError('Ошибка. Проверьте логин или пароль.');
    }
  };

  const handleSignUp = async () => {
    let valid = true;
    if (!validateUsername(username)) {
      setUsernameError('Логин состоит только из латинских букв и цифр, первая буква, длина от 4 до 20 символов');
      valid = false;
    } else {
      setUsernameError('');
    }

    if (!validateEmail(email)) {
      setEmailError('Введен неправильный email');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!validatePassword(password)) {
      setPasswordError('Пароль должен содержать не менее 6 символов, включающий как минимум одну заглавную букву, одну цифру и один специальный символ.');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (!valid) {
      return;
    }

    const response = await dispatch(signUp({ username, fullName, email, password }));
    console.log('response=',response);
    if (signUp.fulfilled.match(response)) {
      navigate('/');
    } else {
      setError('Имя пользователя уже занято');
    }
  };

  return (
    <Center h={700}>
      <Container style={{"backgroundImage": 'url("../public/logo192.png")', "backgroundrepeat": 'repeat'} }>
        {action === 'signup' && (
          <>
            <TextInput
              style={{ width: '400px' }}
              label="Логин"
              size='md'
              value={username}
              error={usernameError}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Space h="lg" />
            <TextInput
              style={{ width: '400px' }}
              label="Полное имя"
              size='md'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <Space h="lg" />
            <TextInput
              style={{ width: '400px' }}
              label="Email"
              size='md'
              value={email}
              error={emailError}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Space h="lg" />
          </>
        )}
        {action === 'signin' && (
          <>
            <TextInput
              style={{ color: "white", width: '500px' }}
              label="Введите логин:"
              size='md'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Space h="lg" />
          </>
        )}
        <PasswordInput
          style={{ color: "white", width: '500px' }}
          size="md"
          label="Введите пароль:"
          value={password}
          error={passwordError}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (action === 'signin' ? handleLogin() : handleSignUp())}
        />
        <Space h="xl" />
        {error && (
          <Center>
            <div style={{ color: 'red' }}>{error}</div>
          </Center>
        )}
        {action === 'signin' ? (
          <>
            <Center>
              <Button variant="filled" size='md' style={{ width: '150px' }} onClick={handleLogin}>
                Авторизация
              </Button>
            </Center>
            <Space h="md" />
            <Center>
              <Anchor href="/signup">
                Регистрация
              </Anchor>
            </Center>
          </>
        ) : (
          <Center>
<Button variant="filled" size='md' style={{ width: '200px', fontSize: '14px' }} onClick={handleSignUp}>
  Зарегистрироваться
</Button>
          </Center>
        )}
      </Container>
    </Center>
  );
}

export default Auth;