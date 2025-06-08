import { Component } from '@angular/core';
import { Task } from '@app/task';
import { TaskComponent } from '@app/task/task.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../task.service'; // Adjust path if necessary, assuming it's one level up

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskComponent, CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {
  tasks: Task[] = [];

  newTaskTitle: string = "";
  newTaskDescription: string = "";
  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadTasks();
  }
  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        console.log(tasks)
        this.tasks = tasks;
        console.log('Tasks loaded successfully:', tasks);
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
      }
    });
  }
  addTask(): void {
    if (this.newTaskTitle.trim() === '') {
      console.warn("Task title cannot be empty.");
      return;
    }

    // Call the service to create a task
    this.taskService.createTask({
      title: this.newTaskTitle,
      description: this.newTaskDescription
    }).subscribe({
      next: (createdTask) => {
        this.tasks.push(createdTask); // Add the new task to the local array
        this.newTaskTitle = ''; // Clear input fields
        this.newTaskDescription = '';
        console.log('Task added:', createdTask);
      },
      error: (error) => {
        console.error('Error adding task:', error);
      }
    });
  }
  updateTask(task: Task): void {
    // Call the service to update task status
    this.taskService.updateTaskStatus(task.id, task.title, task.description, task.completed).subscribe({
      next: (updatedTask) => {
        // Find the task in the local array and update it
        const index = this.tasks.findIndex(t => t.id === updatedTask.id);
        if (index > -1) {
          this.tasks[index] = updatedTask;
        }
        console.log('Task status updated:', updatedTask);
      },
      error: (error) => {
        console.error('Error updating task status:', error);
      }
    });
  }

  deleteTask(id: number): void { // Changed id type to string, matching Task interface
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task.id !== id); // Remove from local array
        console.log('Task deleted:', id);
      },
      error: (error) => {
        console.error('Error deleting task:', error);
      }
    });
  }

}
