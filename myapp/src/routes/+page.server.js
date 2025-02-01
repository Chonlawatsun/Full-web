import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } from '$env/static/private';
import mysql from 'mysql2/promise';

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');

    try {
      // เชื่อมต่อฐานข้อมูล
      const pool = mysql.createPool({
        host: "127.0.0.1",
        user: "root",
        password: "",  // ไม่มีรหัสผ่าน
        database: "my_database"
      });
      

      // เพิ่มข้อมูลลงตาราง
      await pool.query(
        'INSERT INTO users (name, email) VALUES (?, ?)',
        [name, email]
      );

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};