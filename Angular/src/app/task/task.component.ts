import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from '@app/task';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {
  @Input() task!: Task;

  @Output() updateTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<number>();

  isEditMode: boolean = false;

  editedTitle: string = "";
  editedDescription: string = "";

  handleDeleteTask() {
    this.deleteTask.emit(this.task.id);
  }
  handleEditTask() {
    this.updateTask.emit(this.task);
  }


  handleToggleEditMode() {
    this.isEditMode = !this.isEditMode;
    this.editedTitle = this.task.title;
    this.editedDescription = this.task.description;
  }

  handleSubmitEdit() {
    if(this.editedTitle.trim() == ""){
      console.warn("Title cannot be empty");
      return;
    }
    this.task.description = this.editedDescription;
    this.task.title = this.editedTitle;
    this.isEditMode = !this.isEditMode;
    this.updateTask.emit(this.task);

  }
  handleToggleTaskComplete() {
    this.task.completed = !this.task.completed;
    this.updateTask.emit(this.task);

  }

}
