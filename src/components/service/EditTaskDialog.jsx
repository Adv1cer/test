"use client"

import React from 'react';
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
} from "@/components/ui/dialog";

const reverseJobtypeMapping = {
  1: 'development',
  2: 'test',
  3: 'document',
};

const reverseStatusMapping = {
  1: 'ดำเนินการ',
  2: 'เสร็จสิ้น',
  3: 'ยกเลิก',
};

export default function EditTaskDialog({ task, handleEditSubmit, handleDelete }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = {
      jobtype_id: parseInt(event.target.taskType.value, 10),
      jobname: event.target.taskName.value,
      start_time: event.target.startTime.value,
      end_time: event.target.endTime.value,
      status_id: parseInt(event.target.status.value, 10),
      created_at: event.target.createdAt.value,
      updated_at: event.target.updatedAt.value,
      task_id: task.task_id, // Pass the task_id
    };
    console.log('Form Data:', formData);
    handleEditSubmit(event, formData);
  };

  const handleDeleteClick = () => {
    handleDelete(task.task_id);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Edit the task details and click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="taskType" className="text-right">
                ประเภทงาน
              </Label>
              <select
                id="taskType"
                name="taskType"
                defaultValue={task.jobtype_id}
                className="col-span-3"
              >
                <option value="1">Development</option>
                <option value="2">Test</option>
                <option value="3">Document</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="taskName" className="text-right">
                ชื่องานที่ดำเนินการ
              </Label>
              <Input
                id="taskName"
                name="taskName"
                defaultValue={task.jobname}
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
                defaultValue={task.start_time}
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
                defaultValue={task.end_time}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                สถานะ
              </Label>
              <select
                id="status"
                name="status"
                defaultValue={task.status_id}
                className="col-span-3"
              >
                <option value="1">ดำเนินการ</option>
                <option value="2">เสร็จสิ้น</option>
                <option value="3">ยกเลิก</option>
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
                defaultValue={task.created_at}
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
                defaultValue={task.updated_at}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
            <Button variant="destructive" onClick={handleDeleteClick}>Remove</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}