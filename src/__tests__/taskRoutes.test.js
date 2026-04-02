import request from 'supertest';
import express from 'express';
import taskRoutes from '../routes/taskRoutes.js';
import * as taskController from '../controllers/taskController.js';

// Mock the controller
jest.mock('../controllers/taskController.js');

describe('Task Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/tasks', taskRoutes);
    jest.clearAllMocks();
  });

  describe('GET /api/tasks', () => {
    test('should call getTasks controller', async () => {
      taskController.getTasks.mockImplementation((req, res) => {
        res.status(200).json([]);
      });

      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(taskController.getTasks).toHaveBeenCalled();
    });

    test('should return tasks list', async () => {
      const mockTasks = [
        { _id: '1', titre: 'Task 1', statut: 'à faire' }
      ];

      taskController.getTasks.mockImplementation((req, res) => {
        res.status(200).json(mockTasks);
      });

      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].titre).toBe('Task 1');
    });
  });

  describe('GET /api/tasks/:id', () => {
    test('should call getTaskById controller', async () => {
      taskController.getTaskById.mockImplementation((req, res) => {
        res.status(200).json({ _id: '1', titre: 'Task 1' });
      });

      const response = await request(app).get('/api/tasks/1');

      expect(response.status).toBe(200);
      expect(taskController.getTaskById).toHaveBeenCalled();
    });

    test('should return a single task', async () => {
      const mockTask = { _id: '1', titre: 'Task 1', description: 'Description' };

      taskController.getTaskById.mockImplementation((req, res) => {
        res.status(200).json(mockTask);
      });

      const response = await request(app).get('/api/tasks/1');

      expect(response.status).toBe(200);
      expect(response.body.titre).toBe('Task 1');
      expect(response.body.description).toBe('Description');
    });
  });

  describe('POST /api/tasks', () => {
    test('should call createTask controller', async () => {
      taskController.createTask.mockImplementation((req, res) => {
        res.status(201).json({ _id: '1', titre: 'New Task' });
      });

      const newTask = {
        titre: 'New Task',
        statut: 'à faire',
        priorite: 'moyenne'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(newTask);

      expect(response.status).toBe(201);
      expect(taskController.createTask).toHaveBeenCalled();
    });

    test('should return created task with id', async () => {
      const newTask = { titre: 'New Task' };
      const createdTask = { _id: '1', ...newTask };

      taskController.createTask.mockImplementation((req, res) => {
        res.status(201).json(createdTask);
      });

      const response = await request(app)
        .post('/api/tasks')
        .send(newTask);

      expect(response.status).toBe(201);
      expect(response.body._id).toBe('1');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    test('should call updateTask controller', async () => {
      taskController.updateTask.mockImplementation((req, res) => {
        res.status(200).json({ _id: '1', titre: 'Updated Task' });
      });

      const updatedTask = { titre: 'Updated Task' };

      const response = await request(app)
        .put('/api/tasks/1')
        .send(updatedTask);

      expect(response.status).toBe(200);
      expect(taskController.updateTask).toHaveBeenCalled();
    });

    test('should return updated task', async () => {
      const updatedData = { statut: 'terminée' };
      const result = { _id: '1', titre: 'Task 1', ...updatedData };

      taskController.updateTask.mockImplementation((req, res) => {
        res.status(200).json(result);
      });

      const response = await request(app)
        .put('/api/tasks/1')
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.statut).toBe('terminée');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    test('should call deleteTask controller', async () => {
      taskController.deleteTask.mockImplementation((req, res) => {
        res.status(204).json({});
      });

      const response = await request(app).delete('/api/tasks/1');

      expect(response.status).toBe(204);
      expect(taskController.deleteTask).toHaveBeenCalled();
    });

    test('should return 204 No Content', async () => {
      taskController.deleteTask.mockImplementation((req, res) => {
        res.status(204).send();
      });

      const response = await request(app).delete('/api/tasks/1');

      expect(response.status).toBe(204);
    });
  });

  describe('Route error handling', () => {
    test('should return 404 for invalid route', async () => {
      const response = await request(app).get('/api/tasks/invalid/route');

      expect(response.status).toBe(404);
    });
  });
});
