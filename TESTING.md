## Scripts tests

```bash
# Exécuter tous les tests
npm test

# Exécuter les tests en mode watch (re-exécuter à chaque sauvegarde)
npm run test:watch

# Exécuter les tests avec couverture de code
npm test -- --coverage
```

## Structure des tests

Les tests sont organisés dans le dossier `src/__tests__/`:

### 1. **Task.test.js** - Tests du modèle
- Validation des champs du schéma
- Champs requis vs optionnels
- Types de données (Array, Date, etc.)
- Validation des sous-objets

Test example:
```bash
npm test -- Task.test.js
```

### 2. **taskController.test.js** - Tests du contrôleur
- Fonction `getTasks` avec filtres, tri, recherche
- Fonction `getTaskById`
- Fonction `createTask`
- Fonction `updateTask`
- Fonction `deleteTask`
- Gestion des erreurs

Test example:
```bash
npm test -- taskController.test.js
```

### 3. **taskRoutes.test.js** - Tests des routes API
- Routes GET, POST, PUT, DELETE
- Codes status HTTP corrects
- Données renvoyées

Test example:
```bash
npm test -- taskRoutes.test.js
```

## Coverage de code

Pour voir quelle partie du code est couverte par les tests:

```bash
npm test -- --coverage
```

Cela génère un rapport dans le dossier `coverage/`.

## Exemple de test

```javascript
test('should create a task with required fields', () => {
  const taskData = {
    titre: 'Ma première tâche'
  };
  
  const task = new Task(taskData);
  expect(task.titre).toBe('Ma première tâche');
  expect(task.dateCreation).toBeDefined();
});
```

## Configuration

Voir `jest.config.js` pour les paramètres:
- `testEnvironment`: 'node' (pour tester du code backend)
- `testMatch`: Fichiers à exécuter (tous les `*.test.js`)
- `collectCoverageFrom`: Fichiers à surveiller pour la couverture

## Mocking

Pour les tests du contrôleur et des routes, les dépendances sont mockées:
- `jest.mock('../models/Task.js')` - Mock du modèle MongoDB
- `jest.mock('../controllers/taskController.js')` - Mock du contrôleur

Cela permet de tester de manière isolée sans base de données.