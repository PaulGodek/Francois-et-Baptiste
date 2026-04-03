import Task from '../models/Task.js';

describe('Task Model', () => {
  
  describe('Schema validation', () => {
    test('should create a task with required fields', () => {
      const taskData = {
        titre: 'Ma première tâche'
      };
      
      const task = new Task(taskData);
      expect(task.titre).toBe('Ma première tâche');
      expect(task.dateCreation).toBeDefined();
    });

    test('should create a task with all fields', () => {
      const taskData = {
        titre: 'Tâche complète',
        description: 'Une description détaillée',
        statut: 'en cours',
        priorite: 'haute',
        categorie: 'travail',
        etiquettes: ['urgent', 'important'],
        echeance: new Date('2026-12-31'),
        sousTaches: [
          { titre: 'Sous-tâche 1', statut: 'à faire', echeance: new Date('2026-06-15') }
        ],
        commentaires: [
          { date: new Date(), contenu: 'Un commentaire' }
        ]
      };
      
      const task = new Task(taskData);
      expect(task.titre).toBe('Tâche complète');
      expect(task.description).toBe('Une description détaillée');
      expect(task.statut).toBe('en cours');
      expect(task.priorite).toBe('haute');
      expect(task.etiquettes).toHaveLength(2);
      expect(task.sousTaches).toHaveLength(1);
      expect(task.commentaires).toHaveLength(1);
    });

    test('should have default dateCreation', () => {
      const task = new Task({ titre: 'Test' });
      expect(task.dateCreation).toBeInstanceOf(Date);
    });

    test('should fail validation without titre', () => {
      const task = new Task({ description: 'Sans titre' });
      const error = task.validateSync();
      expect(error).toBeDefined();
      expect(error.errors.titre).toBeDefined();
    });

    test('should have optional fields', () => {
      const task = new Task({ titre: 'Test minimal' });
      expect(task.description).toBeUndefined();
      expect(task.categorie).toBeUndefined();
      expect(task.etiquettes).toEqual([]);
      expect(task.sousTaches).toEqual([]);
      expect(task.commentaires).toEqual([]);
    });
  });

  describe('Field types', () => {
    test('etiquettes should be an array', () => {
      const task = new Task({
        titre: 'Test',
        etiquettes: ['tag1', 'tag2', 'tag3']
      });
      expect(Array.isArray(task.etiquettes)).toBe(true);
      expect(task.etiquettes).toHaveLength(3);
    });

    test('sousTaches should have titre, statut, and echeance', () => {
      const task = new Task({
        titre: 'Parent',
        sousTaches: [
          { titre: 'Sous-1', statut: 'terminée', echeance: new Date() }
        ]
      });
      expect(task.sousTaches[0].titre).toBe('Sous-1');
      expect(task.sousTaches[0].statut).toBe('terminée');
    });
  });
});
