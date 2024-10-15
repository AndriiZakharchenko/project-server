// Define User Type
export type User = {
  id: string;
  name: string;
  email: string;
  hobbies: string[];
};

export const db: User[] = [
  {
    id: 'b2502e61-5557-408a-b39d-e4abe7c000d7',
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
