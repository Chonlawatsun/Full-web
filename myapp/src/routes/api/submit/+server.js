import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } from '$env/static/private';
import mysql from 'mysql2/promise';

export async function POST({ request }) {
  try {
    const { name, email, phone, message } = await request.json();

    // เชื่อมต่อฐานข้อมูล
    const pool = mysql.createPool({
        host: "127.0.0.1",
        user: "root",
        password: "",  // ไม่มีรหัสผ่าน
        database: "my_database"
      });
      

    // บันทึกข้อมูล
    await pool.query(
      'INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)',
      [name, email, phone, message]
    );

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}