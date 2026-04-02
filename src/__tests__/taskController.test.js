import { 
  getTasks, 
  getTaskById, 
  createTask, 
  updateTask, 
  deleteTask 
} from '../controllers/taskController.js';
import Task from '../models/Task.js';

// Mock the Task model
jest.mock('../models/Task.js');

describe('Task Controller', () => {
  let req, res;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Setup mock request and response objects
    req = {
      query: {},
      params: {},
      body: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  describe('getTasks', () => {
    test('should return all tasks when no filters', async () => {
      const mockTasks = [
        { _id: '1', titre: 'Task 1', statut: 'à faire' },
        { _id: '2', titre: 'Task 2', statut: 'terminée' }
      ];
      
      Task.find.mockResolvedValue(mockTasks);
      
      await getTasks(req, res);
      
      expect(Task.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTasks);
    });

    test('should filter tasks by statut', async () => {
      req.query = { statut: 'à faire' };
      const mockTasks = [{ _id: '1', titre: 'Task 1', statut: 'à faire' }];
      
      Task.aggregate.mockResolvedValue(mockTasks);
      
      await getTasks(req, res);
      
      expect(Task.aggregate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTasks);
    });

    test('should filter tasks by priorite', async () => {
      req.query = { priorite: 'haute' };
      const mockTasks = [{ _id: '1', titre: 'Important', priorite: 'haute' }];
      
      Task.aggregate.mockResolvedValue(mockTasks);
      
      await getTasks(req, res);
      
      expect(Task.aggregate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test('should search by text query (titre or description)', async () => {
      req.query = { q: 'urgent' };
      const mockTasks = [
        { _id: '1', titre: 'Urgent meeting', description: 'Important call' }
      ];
      
      Task.aggregate.mockResolvedValue(mockTasks);
      
      await getTasks(req, res);
      
      expect(Task.aggregate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test('should sort by dateCreation ascending', async () => {
      req.query = { tri: 'dateCreation', order: 'asc' };
      const mockTasks = [
        { _id: '1', titre: 'Old', dateCreation: new Date('2024-01-01') },
        { _id: '2', titre: 'New', dateCreation: new Date('2025-01-01') }
      ];
      
      Task.aggregate.mockResolvedValue(mockTasks);
      
      await getTasks(req, res);
      
      expect(Task.aggregate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test('should sort by priorite descending', async () => {
      req.query = { tri: 'priorite', order: 'desc' };
      const mockTasks = [
        { _id: '1', titre: 'Critical', priorite: 'critique' },
        { _id: '2', titre: 'Low', priorite: 'basse' }
      ];
      
      Task.aggregate.mockResolvedValue(mockTasks);
      
      await getTasks(req, res);
      
      expect(Task.aggregate).toHaveBeenCalled();
    });

    test('should handle errors gracefully', async () => {
      const error = new Error('Database error');
      Task.find.mockRejectedValue(error);
      
      await getTasks(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getTaskById', () => {
    test('should return a task by id', async () => {
      const mockTask = { _id: '1', titre: 'Task 1' };
      req.params = { id: '1' };
      
      Task.findById.mockResolvedValue(mockTask);
      
      await getTaskById(req, res);
      
      expect(Task.findById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTask);
    });

    test('should handle error when task not found', async () => {
      req.params = { id: 'invalid' };
      const error = new Error('Task not found');
      
      Task.findById.mockRejectedValue(error);
      
      await getTaskById(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('createTask', () => {
    test('should create a new task', async () => {
      req.body = {
        titre: 'New Task',
        description: 'Description',
        statut: 'à faire',
        priorite: 'moyenne'
      };
      
      const mockTask = { _id: '1', ...req.body };
      Task.create.mockResolvedValue(mockTask);
      
      await createTask(req, res);
      
      expect(Task.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockTask);
    });

    test('should handle creation error', async () => {
      req.body = { titre: 'Task' };
      const error = new Error('Validation failed');
      
      Task.create.mockRejectedValue(error);
      
      await createTask(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('updateTask', () => {
    test('should update a task', async () => {
      req.params = { id: '1' };
      req.body = {
        titre: 'Updated Task',
        statut: 'terminée'
      };
      
      const mockTask = { _id: '1', ...req.body };
      Task.findByIdAndUpdate.mockResolvedValue(mockTask);
      
      await updateTask(req, res);
      
      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
        '1',
        req.body,
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTask);
    });

    test('should handle update error', async () => {
      req.params = { id: '1' };
      const error = new Error('Update failed');
      
      Task.findByIdAndUpdate.mockRejectedValue(error);
      
      await updateTask(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('deleteTask', () => {
    test('should delete a task', async () => {
      req.params = { id: '1' };
      const mockTask = { _id: '1', titre: 'Deleted Task' };
      
      Task.findByIdAndDelete.mockResolvedValue(mockTask);
      
      await deleteTask(req, res);
      
      expect(Task.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith(mockTask);
    });

    test('should handle delete error', async () => {
      req.params = { id: 'invalid' };
      const error = new Error('Delete failed');
      
      Task.findByIdAndDelete.mockRejectedValue(error);
      
      await deleteTask(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
