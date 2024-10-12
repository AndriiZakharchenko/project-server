// Define User Type
export type User = {
  id: string;
  name: string;
  email: string;
  hobbies: string[];
};

export const db: User[] = [
  {
    id: '5f3b4b29-03dd-4ed9-84a3-6dfcfz4c2be98',
    name: 'John Doe',
    email: 'john@example.com',
    hobbies: ['reading', 'coding'],
  },
  {
    id: '5f3b4b29-03dd-4ed9-84a3-6dfcfz4c2be98',
    name: 'John TTT',
    email: 'ttt@example.com',
    hobbies: ['reading'],
  },
];
