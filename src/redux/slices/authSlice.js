import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const initialUsersState = {
  user: {},
  loading: false,
  error: null
}

const apiUrl = process.env.REACT_APP_API_URL;

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ username, password }) => {
    const response = await fetch(apiUrl+`/register/`, {   
    //const response = await fetch(`http://127.0.0.1:8000/register/`, {   

      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Invalid data');
    }

    const data = await response.json();
    sessionStorage.setItem('user', JSON.stringify(data.user));
    return data
  }
)


export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }) => {
    try {
      //const response = await fetch(`http://127.0.0.1:8000/login/`, {
        const response = await fetch(apiUrl+`/login/`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid data');
      }

      const data = await response.json();
      sessionStorage.setItem('user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      throw error;
    }
  }
);

export const checkUser = createAsyncThunk(
  'auth/checkUser',
  async () => {
    try {
      //const response = await fetch(`http://127.0.0.1:8000/api/users/${JSON.parse(sessionStorage.getItem('user')).id}/`, {
        const response = await fetch(apiUrl+`/api/users/${JSON.parse(sessionStorage.getItem('user')).id}/`, {
        credentials: 'include',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + JSON.parse(sessionStorage.getItem('user')).token,
        },
      });

      if (!response.ok) {
        throw new Error('Invalid data');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    //const response = await fetch(`http://127.0.0.1:8000/logout/`, {
      const response = await fetch(apiUrl+`/logout/`, {
      credentials: 'include',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + JSON.parse(sessionStorage.getItem('user')).token,
      },
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }
    sessionStorage.clear();
  });

  export const changeUsername = createAsyncThunk(
    'auth/changeUsername',
    async ({ newUsername }) => {
      //const response = await fetch(`http://127.0.0.1:8000/api/users/${JSON.parse(sessionStorage.getItem('user')).id}/`, {
        const response = await fetch(apiUrl+`/api/users/${JSON.parse(sessionStorage.getItem('user')).id}/`, {
        credentials: 'include',
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + JSON.parse(sessionStorage.getItem('user')).token,
        },
        body: JSON.stringify({ username: newUsername }),
      });

      if (!response.ok) {
        throw new Error('Invalid data');
      }
    }
  )

  export const changePassword = createAsyncThunk(
    'auth/changePassword',
    async ({ newPassword }) => {
      //await fetch(`http://127.0.0.1:8000/api/users/${JSON.parse(sessionStorage.getItem('user')).id}/`, {
        await fetch(apiUrl+`/api/users/${JSON.parse(sessionStorage.getItem('user')).id}/`, {
        credentials: 'include',
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + JSON.parse(sessionStorage.getItem('user')).token,
        },
        body: JSON.stringify({ password: newPassword }),
      });
    }
  )


const authSlice = createSlice({
  name: 'auth',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.rejected, (state, action) => {
      state.error = action.error.message || 'Login failed';
    });
    builder.addCase(signUp.rejected, (state, action) => {
      state.error = action.error.message || 'Signup failed';
    });
    builder.addCase(checkUser.rejected, (state, action) => {
      state.error = action.error.message || 'Check user failed';
    });
    builder.addCase(checkUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});


export default authSlice.reducer;
