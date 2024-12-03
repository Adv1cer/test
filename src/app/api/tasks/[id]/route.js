import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

export async function PUT(req, { params }) {
  const { id } = params;
  const newData = await req.json();

  console.log("Received Data:", newData);
  console.log("Task ID:", id);

  if (!id) {
    return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
  }

  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);

    // Fetch the existing task data
    const [existingRows] = await connection.execute(`
      SELECT jobtype_id, jobname, start_time, end_time, status_id, created_at, updated_at
      FROM task
      WHERE task_id = ?
    `, [id]);

    if (existingRows.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const existingData = existingRows[0];

    // Merge the existing data with the new data
    const mergedData = {
      jobtype_id: newData.jobtype_id !== undefined ? newData.jobtype_id : existingData.jobtype_id,
      jobname: newData.jobname !== undefined ? newData.jobname : existingData.jobname,
      start_time: newData.start_time !== undefined ? newData.start_time : existingData.start_time,
      end_time: newData.end_time !== undefined ? newData.end_time : existingData.end_time,
      status_id: newData.status_id !== undefined ? newData.status_id : existingData.status_id,
      created_at: newData.created_at !== undefined ? newData.created_at : existingData.created_at,
      updated_at: newData.updated_at !== undefined ? newData.updated_at : existingData.updated_at,
    };

    // Ensure no undefined values are passed to the query
    const queryParams = [
      mergedData.jobtype_id,
      mergedData.jobname,
      mergedData.start_time,
      mergedData.end_time,
      mergedData.status_id,
      mergedData.created_at,
      mergedData.updated_at,
      id
    ];

    console.log("Query Parameters:", queryParams);

    if (queryParams.includes(undefined)) {
      return NextResponse.json({ error: 'Invalid data provided' }, { status: 400 });
    }

    const result = await connection.execute(`
      UPDATE task
      SET jobtype_id = ?,
          jobname = ?,
          start_time = ?,
          end_time = ?,
          status_id = ?,
          created_at = ?,
          updated_at = ?
      WHERE task_id = ?
    `, queryParams);

    return NextResponse.json({ message: 'Task updated successfully', result }, { status: 200 });
  } catch (error) {
    console.error('Error executing query:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection && connection.end) {
      await connection.end();
    }
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
  }

  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);

    const [result] = await connection.execute(`
      DELETE FROM task
      WHERE task_id = ?
    `, [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error executing query:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection && connection.end) {
      await connection.end();
    }
  }
}