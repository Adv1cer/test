import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

export async function GET() {
  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);

    const query = `
      SELECT 
        t.task_id, 
        jt.jobtype_name, 
        t.jobname, 
        t.start_time, 
        t.end_time, 
        s.status_name, 
        t.created_at, 
        t.updated_at
      FROM task t
      JOIN jobtype jt ON t.jobtype_id = jt.jobtype_id
      JOIN status s ON t.status_id = s.status_id
      ORDER BY t.task_id ASC
    `;

    const [rows] = await connection.execute(query);
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('Error executing query:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection && connection.end) {
      await connection.end();
    }
  }
}

export async function POST(req) {
  const { taskType, taskName, startTime, endTime, status, createdAt, updatedAt } = await req.json();

  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);

    const result = await connection.execute(`
      INSERT INTO task (jobtype_id, jobname, start_time, end_time, status_id, created_at, updated_at)
      VALUES ((SELECT jobtype_id FROM jobtype WHERE jobtype_name = ?), ?, ?, ?, (SELECT status_id FROM status WHERE status_name = ?), ?, ?)
    `, [taskType, taskName, startTime, endTime, status, createdAt, updatedAt]);

    return NextResponse.json({ message: 'Task added successfully', result }, { status: 200 });
  } catch (error) {
    console.error('Error executing query:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection && connection.end) {
      await connection.end();
    }
  }
}