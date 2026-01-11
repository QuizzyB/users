import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {User} from "./types.ts";
import {
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
} from './usersThunks';

interface UsersState {
    users: User[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    itemsPerPage: number;
    sortField: keyof User | null;
    sortOrder: 'asc' | 'desc';
}

const initialState: UsersState = {
    users: [],
    loading: false,
    error: null,
    currentPage: 1,
    itemsPerPage: 5,
    sortField: null,
    sortOrder: 'asc',
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setPage(state, action: PayloadAction<number>) {
            state.currentPage = action.payload;
        },
        setSorting(state, action: PayloadAction<keyof User>) {
            if (state.sortField === action.payload) {
                state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                state.sortField = action.payload;
                state.sortOrder = 'asc';
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'Ошибка';
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.users.push(action.payload);
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const index = state.users.findIndex(
                    (u) => u.id === action.payload.id
                );
                if (index !== -1) state.users[index] = action.payload;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(
                    (u) => u.id !== action.payload
                );
            });
    },
});

export const { setPage, setSorting } = usersSlice.actions;
export const usersReducer = usersSlice.reducer;
