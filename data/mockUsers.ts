export interface User {
    id: string;
    name: string;
    avatar: string;
}

export const allUsers: User[] = [
    { id: 'user-1', name: 'Alice Johnson', avatar: 'https://api.dicebear.com/8.x/initials/svg?seed=Alice' },
    { id: 'user-2', name: 'Bob Williams', avatar: 'https://api.dicebear.com/8.x/initials/svg?seed=Bob' },
    { id: 'user-3', name: 'Charlie Brown', avatar: 'https://api.dicebear.com/8.x/initials/svg?seed=Charlie' },
    { id: 'user-4', name: 'Diana Miller', avatar: 'https://api.dicebear.com/8.x/initials/svg?seed=Diana' },
    { id: 'user-5', name: 'Ethan Davis', avatar: 'https://api.dicebear.com/8.x/initials/svg?seed=Ethan' },
    { id: 'user-6', name: 'Fiona Garcia', avatar: 'https://api.dicebear.com/8.x/initials/svg?seed=Fiona' },
    { id: 'user-7', name: 'George Rodriguez', avatar: 'https://api.dicebear.com/8.x/initials/svg?seed=George' },
];
