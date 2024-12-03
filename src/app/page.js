"use client"
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import EditTaskDialog from '@/components/service/EditTaskDialog';
import { format } from 'date-fns';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [latestUpdatedTime, setLatestUpdatedTime] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const data = await response.json();
          setTasks(data);
          findLatestUpdatedTime(data);
        } else {
          console.error('Network response was not ok');
        }
      } catch (error) {
        console.error('There was an error fetching the tasks!', error);
      }
    };

    fetchTasks();
  }, []);

  const findLatestUpdatedTime = (tasks) => {
    if (tasks.length === 0) return;
    const latestTask = tasks.reduce((latest, task) => {
      return new Date(task.updated_at) > new Date(latest.updated_at) ? task : latest;
    });
    setLatestUpdatedTime(latestTask.updated_at);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      taskType: event.target.taskType.value,
      taskName: event.target.taskName.value,
      startTime: event.target.startTime.value,
      endTime: event.target.endTime.value,
      status: event.target.status.value,
      createdAt: event.target.createdAt.value,
      updatedAt: event.target.updatedAt.value,
    };

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("บันทึกข้อมูลสำเร็จ");
        location.reload();
      } else {
        alert("ไม่สามารถบันทึกข้อมูลได้");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("เกิดข้อผิดพลาด");
    }
  };

  const handleEditSubmit = async (event, formData) => {
    event.preventDefault();
  
    console.log('Form Data:', formData);
  
    try {
      const response = await fetch(`/api/tasks/${formData.task_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        alert("บันทึกข้อมูลสำเร็จ");
        location.reload();
      } else {
        alert("ไม่สามารถบันทึกข้อมูลได้");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("เกิดข้อผิดพลาด");
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        alert("ลบข้อมูลสำเร็จ");
        location.reload();
      } else {
        alert("ไม่สามารถลบข้อมูลได้");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="table-container">
      <table className="styled-table">
        <thead>
          <tr>
            <th>ไอดีงาน</th>
            <th>ประเภทงาน</th>
            <th>ชื่องานที่ดำเนินการ</th>
            <th>เวลาที่เริ่มดำเนินการ</th>
            <th>เวลาที่เสร็จสิ้น</th>
            <th>สถานะ</th>
            <th>วันเวลาที่บันทึกข้อมูล</th>
            <th>วันเวลาที่ปรับปรุงข้อมูลล่าสุด</th>
            <th><Dialog>
              <DialogTrigger asChild>
                <Button>เพิ่มงาน</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>เพิ่มงาน</DialogTitle>
                  <DialogDescription>
                    เพื่มงานที่ต้องการดำเนินการ
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="taskType" className="text-right">
                        ประเภทงาน
                      </Label>
                      <select id="taskType" name="taskType" className="col-span-3">
                        <option value="development">Development</option>
                        <option value="test">Test</option>
                        <option value="document">Document</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="taskName" className="text-right">
                        ชื่องานที่ดำเนินการ
                      </Label>
                      <Input
                        id="taskName"
                        name="taskName"
                        placeholder="Task Name"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="startTime" className="text-right">
                        เวลาที่เริ่มดำเนินการ
                      </Label>
                      <Input
                        id="startTime"
                        name="startTime"
                        type="datetime-local"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="endTime" className="text-right">
                        เวลาที่เสร็จสิ้น
                      </Label>
                      <Input
                        id="endTime"
                        name="endTime"
                        type="datetime-local"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="status" className="text-right">
                        สถานะ
                      </Label>
                      <select id="status" name="status" className="col-span-3">
                        <option value="ดำเนินการ">ดำเนินการ</option>
                        <option value="เสร็จสิ้น">เสร็จสิ้น</option>
                        <option value="ยกเลิก">ยกเลิก</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="createdAt" className="text-right">
                        วันเวลาที่บันทึกข้อมูล
                      </Label>
                      <Input
                        id="createdAt"
                        name="createdAt"
                        type="datetime-local"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="updatedAt" className="text-right">
                        วันเวลาที่ปรับปรุงข้อมูลล่าสุด
                      </Label>
                      <Input
                        id="updatedAt"
                        name="updatedAt"
                        type="datetime-local"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">สร้างงาน</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>      </th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.task_id}>
              <td>{task.task_id}</td>
              <td>{task.jobtype_name}</td>
              <td>{task.jobname}</td>
              <td>{format(new Date(task.start_time), 'hh:mm a')}</td>
              <td>{format(new Date(task.end_time), 'hh:mm a')}</td>
              <td>{task.status_name}</td>
              <td>{format(new Date(task.created_at), 'yyyy-MM-dd hh:mm a')}</td>
              <td>{format(new Date(task.updated_at), 'yyyy-MM-dd hh:mm a')}</td>
              <td><EditTaskDialog task={task} handleEditSubmit={handleEditSubmit} handleDelete={handleDelete} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}