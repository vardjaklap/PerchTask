// src/app/services/task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Task } from './task';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // Base URL for your Node.js API
  // Make sure this matches the port your Node.js server is running on
  private apiUrl = 'http://localhost:3000/v1/tasks';

  // HTTP options for sending JSON data
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  /**
   * Handles HTTP errors.
   * @param error The HTTP error response.
   * @returns An observable that emits an error.
   */
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error.error.message || error.message);
    // You could expand this to show a user-friendly message
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  /**
   * Sends a POST request to create a new task.
   * @param taskData Object containing title and optional description.
   * @returns An Observable of the newly created Task.
   */
  createTask(taskData: { title: string; description?: string }): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, taskData, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Sends a GET request to retrieve all tasks.
   * @returns An Observable of an array of Tasks.
   */
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Sends a PATCH request to update the status of a task.
   * @param id The ID of the task to update.
   * @param completed The new completion status (boolean).
   * @returns An Observable of the updated Task.
   */
  updateTaskStatus(id: number, title: string, description: string, completed: boolean): Observable<Task> {
    const body = { title, description, completed };
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, body, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Sends a DELETE request to remove a task.
   * @param id The ID of the task to delete.
   * @returns An Observable of type any (or void if your backend sends no content).
   */
  deleteTask(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }
}
