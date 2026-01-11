import { createAsyncThunk } from '@reduxjs/toolkit';
import { usersApi } from '../api/usersApi';
import type { User } from './types';

export const fetchUsers = createAsyncThunk<User[]>(
    'users/fetch',
    usersApi.fetchUsers
);

export const createUser = createAsyncThunk(
    'users/create',
    usersApi.createUser
);

export const updateUser = createAsyncThunk(
    'users/update',
    usersApi.updateUser
);

export const deleteUser = createAsyncThunk(
    'users/delete',
    usersApi.deleteUser
);
