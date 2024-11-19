import pool from '../../pg-pool.config';

export const executeQuery = (query: string, params: any[] = []) => pool.query(query, params)
  .then((res) => {
    console.log('Query result:', res.rows);
    return res.rows;
  })
  .catch((error) => {
    console.error('Error executing query:', error);
    return [];
  });
