import type { User } from '../model/types';

const API_URL = 'https://696348b82d146d9f58d31679.mockapi.io/users/users';

export const usersApi = {
    fetchUsers: async (): Promise<User[]> => {
        const res = await fetch(API_URL);
        return res.json();
    },

    createUser: async (user: Omit<User, 'id'>): Promise<User> => {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });
        return res.json();
    },

    updateUser: async (user: User): Promise<User> => {
        const res = await fetch(`${API_URL}/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });
        return res.json();
    },

    deleteUser: async (id: string): Promise<string> => {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        return id;
    },
};
