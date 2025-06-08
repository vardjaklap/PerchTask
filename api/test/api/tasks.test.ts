import request from 'supertest';

import app from '../../src/app';
import Task from '../../src/database/models/task.model';


describe('Task API Routes', () => {

    beforeEach(() => {
        Task.truncate();
    });

    describe('POST /v1/tasks', () => {
        it('should create a new task and return status code 201', async () => {
            const newTask = {
                title: 'New Task for POST',
                description: 'This is a new task description.',
            };

            const response = await request(app)
                .post('/v1/tasks') // Updated path
                .send(newTask)
                .expect(201); // Assert status code

            // Assert the response body structure and content
            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe(newTask.title);
            expect(response.body.description).toBe(newTask.description);
            expect(response.body.completed).toBe(false); // New tasks are incomplete by default
        });

        it('should return 400 if title is missing when creating a task', async () => {
            const invalidTask = {
                description: 'This task has no title.',
            };

            const response = await request(app)
                .post('/v1/tasks') // Updated path
                .send(invalidTask)
                .expect(400);

            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('Title is required for a new task.');
        });
    });

    describe('GET /v1/tasks', () => {
        it('should return status code 200 and an empty array if no tasks exist', async () => {
            const response = await request(app)
                .get('/v1/tasks') // Updated path
                .expect(200);

            expect(response.body).toEqual([]);
        });

        it('should return status code 200 and an array of tasks', async () => {
            // First, create a task to ensure there's data to retrieve
            await request(app)
                .post('/v1/tasks') // Updated path
                .send({ title: 'Task 1', description: 'Desc 1' })
                .expect(201);

            await request(app)
                .post('/v1/tasks') // Updated path
                .send({ title: 'Task 2', description: 'Desc 2' })
                .expect(201);

            const response = await request(app)
                .get('/v1/tasks') // Updated path
                .expect(200);

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(2);
            expect(response.body[0]).toHaveProperty('title', 'Task 1');
            expect(response.body[1]).toHaveProperty('title', 'Task 2');
        });
    });



    describe('PATCH /v1/tasks/:id', () => {
        it('should update the specified task status and return status code 200', async () => {
            // Create a task to get a valid ID
            const postResponse = await request(app)
                .post('/v1/tasks') // Updated path
                .send({ title: 'Task to update', description: 'Initial state' })
                .expect(201);

            const taskId = postResponse.body.id;
            const updatedStatus = {
                title: 'Task to update', 
                description: 'Updated state',
                completed: true,
            };

            const patchResponse = await request(app)
                .patch(`/v1/tasks/${taskId}`) // Updated path
                .send(updatedStatus)
                .expect(200);

            expect(patchResponse.body).toHaveProperty('id', taskId);
            expect(patchResponse.body).toHaveProperty('completed', true);

        
        });

        it('should return 400 if completed status is not a boolean', async () => {
            // Create a task to get a valid ID
            const postResponse = await request(app)
                .post('/v1/tasks') // Updated path
                .send({ title: 'Task for bad patch', description: 'Initial state' })
                .expect(201);

            const taskId = postResponse.body.id;
            const invalidUpdate = {
                title: "123",
                description: "123",
                completed: 'not-a-boolean',
            };

            await request(app)
                .patch(`/v1/tasks/${taskId}`) // Updated path
                .send(invalidUpdate)
                .expect(400);
        });

        it('should return 404 if task to update not found', async () => {
            const nonExistentId = -1;
            const updateBody = {
                title: "123",
                description: "123",
                completed: true,
            };

            await request(app)
                .patch(`/v1/tasks/${nonExistentId}`) // Updated path
                .send(updateBody)
                .expect(404);
        });
    });

    describe('DELETE /v1/tasks/:id', () => {
        it('should delete the specified task and return status code 204', async () => {
            // Create a task to get a valid ID
            const postResponse = await request(app)
                .post('/v1/tasks') // Updated path
                .send({ title: 'Task to delete', description: 'Will be removed' })
                .expect(201);

            const taskId = postResponse.body.id;

            await request(app)
                .delete(`/v1/tasks/${taskId}`) // Updated path
                .expect(204);

            // Verify deletion by attempting to retrieve the task
            await request(app)
                .get(`/v1/tasks/${taskId}`) // Updated path
                .expect(404);
        });

        it('should return status code 404 if task to delete not found', async () => {
            const nonExistentId = -1;

            await request(app)
                .delete(`/v1/tasks/${nonExistentId}`) // Updated path
                .expect(404);
        });
    });
});
