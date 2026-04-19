import { HistoryManager } from '../HistoryManager';
import { GraphMemento } from '../GraphMemento';

describe('HistoryManager', () => {
  let historyManager: HistoryManager;
  let mockMemento1: GraphMemento;
  let mockMemento2: GraphMemento;
  let mockMemento3: GraphMemento;

  beforeEach(() => {
    historyManager = new HistoryManager();

    // Create mock mementos with sample data
    mockMemento1 = new GraphMemento(
      [{ id: 1, label: 'node1' }],
      [{ id: 'e1', from: 1, to: 2 }],
      [
        {
          id: 1,
          name: 'layer1',
          feature: 'dense',
          library: 'pytorch',
          framework: 'pytorch',
          codeId: 'c1',
          inport: 1,
          outport: 1,
          parameters: [],
          code: 'code1',
        },
      ],
    );

    mockMemento2 = new GraphMemento(
      [{ id: 2, label: 'node2' }],
      [{ id: 'e2', from: 2, to: 3 }],
      [
        {
          id: 2,
          name: 'layer2',
          feature: 'conv',
          library: 'pytorch',
          framework: 'pytorch',
          codeId: 'c2',
          inport: 2,
          outport: 2,
          parameters: [],
          code: 'code2',
        },
      ],
    );

    mockMemento3 = new GraphMemento(
      [{ id: 3, label: 'node3' }],
      [{ id: 'e3', from: 3, to: 4 }],
      [
        {
          id: 3,
          name: 'layer3',
          feature: 'pool',
          library: 'pytorch',
          framework: 'pytorch',
          codeId: 'c3',
          inport: 3,
          outport: 3,
          parameters: [],
          code: 'code3',
        },
      ],
    );
  });

  describe('saveState', () => {
    it('should add memento to undoStack', () => {
      historyManager.saveState(mockMemento1);

      expect(historyManager.canUndo()).toBe(true);
    });

    it('should add multiple mementos to undoStack in order', () => {
      historyManager.saveState(mockMemento1);
      historyManager.saveState(mockMemento2);
      historyManager.saveState(mockMemento3);

      expect(historyManager.canUndo()).toBe(true);
      // Verify order by undoing - undo returns the last saved state
      const undone1 = historyManager.undo(mockMemento3);
      expect(undone1?.modelNodes[0].id).toBe(mockMemento3.modelNodes[0].id);
    });

    it('should clear redoStack when new state is saved', () => {
      historyManager.saveState(mockMemento1);
      historyManager.saveState(mockMemento2);

      const currentState = new GraphMemento([], [], []);
      historyManager.undo(currentState);
      expect(historyManager.canRedo()).toBe(true);

      historyManager.saveState(mockMemento3);
      expect(historyManager.canRedo()).toBe(false);
    });

    it('should not exceed maxHistory limit (50)', () => {
      // Add 60 mementos (more than maxHistory)
      for (let i = 0; i < 60; i++) {
        const memento = new GraphMemento(
          [{ id: i, label: `node${i}` }],
          [],
          [
            {
              id: i,
              name: `layer${i}`,
              feature: 'test',
              library: 'pytorch',
              framework: 'pytorch',
              codeId: `c${i}`,
              inport: i,
              outport: i,
              parameters: [],
              code: `code${i}`,
            },
          ],
        );
        historyManager.saveState(memento);
      }

      // Undo 50 times to verify we only have 50 items
      let undoCount = 0;
      const testMemento = new GraphMemento([], [], []);
      while (historyManager.canUndo() && undoCount < 60) {
        historyManager.undo(testMemento);
        undoCount++;
      }

      expect(undoCount).toBeLessThanOrEqual(50);
    });
  });

  describe('canUndo', () => {
    it('should return false when undoStack is empty', () => {
      expect(historyManager.canUndo()).toBe(false);
    });

    it('should return true when undoStack has items', () => {
      historyManager.saveState(mockMemento1);
      expect(historyManager.canUndo()).toBe(true);
    });

    it('should return true after adding multiple states', () => {
      historyManager.saveState(mockMemento1);
      historyManager.saveState(mockMemento2);
      historyManager.saveState(mockMemento3);
      expect(historyManager.canUndo()).toBe(true);
    });
  });

  describe('canRedo', () => {
    it('should return false when redoStack is empty', () => {
      expect(historyManager.canRedo()).toBe(false);
    });

    it('should return true after undo operation', () => {
      historyManager.saveState(mockMemento1);
      historyManager.saveState(mockMemento2);

      const currentState = new GraphMemento([], [], []);
      historyManager.undo(currentState);

      expect(historyManager.canRedo()).toBe(true);
    });

    it('should return false after saveState clears redoStack', () => {
      historyManager.saveState(mockMemento1);
      historyManager.saveState(mockMemento2);

      const currentState = new GraphMemento([], [], []);
      historyManager.undo(currentState);
      expect(historyManager.canRedo()).toBe(true);

      historyManager.saveState(mockMemento3);
      expect(historyManager.canRedo()).toBe(false);
    });
  });

  describe('undo', () => {
    it('should return null when undoStack is empty', () => {
      const result = historyManager.undo(mockMemento1);
      expect(result).toBeNull();
    });

    it('should return previous state from undoStack', () => {
      historyManager.saveState(mockMemento1);
      historyManager.saveState(mockMemento2);

      const currentState = new GraphMemento([], [], []);
      const undoResult = historyManager.undo(currentState);

      expect(undoResult).not.toBeNull();
      expect(undoResult?.modelNodes[0].id).toBe(mockMemento2.modelNodes[0].id);
    });

    it('should move current state to redoStack', () => {
      historyManager.saveState(mockMemento1);
      historyManager.saveState(mockMemento2);

      expect(historyManager.canRedo()).toBe(false);

      const currentState = new GraphMemento([], [], []);
      historyManager.undo(currentState);

      expect(historyManager.canRedo()).toBe(true);
    });

    it('should correctly undo multiple times', () => {
      historyManager.saveState(mockMemento1);
      historyManager.saveState(mockMemento2);
      historyManager.saveState(mockMemento3);

      const currentState = new GraphMemento([], [], []);
      const undo1 = historyManager.undo(currentState);
      expect(undo1?.modelNodes[0].id).toBe(mockMemento3.modelNodes[0].id);

      const undo2 = historyManager.undo(currentState);
      expect(undo2?.modelNodes[0].id).toBe(mockMemento2.modelNodes[0].id);

      const undo3 = historyManager.undo(currentState);
      expect(undo3?.modelNodes[0].id).toBe(mockMemento1.modelNodes[0].id);
    });

    it('should return null when undoStack is exhausted', () => {
      historyManager.saveState(mockMemento1);

      const currentState = new GraphMemento([], [], []);
      historyManager.undo(currentState);

      const result = historyManager.undo(currentState);
      expect(result).toBeNull();
    });
  });

  describe('redo', () => {
    it('should return null when redoStack is empty', () => {
      const result = historyManager.redo(mockMemento1);
      expect(result).toBeNull();
    });

    it('should return next state from redoStack', () => {
      historyManager.saveState(mockMemento1);
      historyManager.saveState(mockMemento2);

      // Undo saves the current state to redoStack and returns the previous
      const currentState = mockMemento2;
      const undoResult = historyManager.undo(currentState);
      expect(undoResult).not.toBeNull();

      // Redo returns what was saved to redoStack during undo (which was the current state)
      const redoResult = historyManager.redo(undoResult!);
      expect(redoResult?.modelNodes[0].id).toBe(currentState.modelNodes[0].id);
    });

    it('should move current state to undoStack', () => {
      historyManager.saveState(mockMemento1);
      historyManager.saveState(mockMemento2);

      const currentState = new GraphMemento([], [], []);
      historyManager.undo(currentState);
      historyManager.redo(currentState);

      expect(historyManager.canUndo()).toBe(true);
    });

    it('should correctly redo multiple times', () => {
      historyManager.saveState(mockMemento1);
      historyManager.saveState(mockMemento2);
      historyManager.saveState(mockMemento3);

      const currentState = new GraphMemento([], [], []);
      const undo1 = historyManager.undo(mockMemento3);
      const undo2 = historyManager.undo(undo1!);
      const undo3 = historyManager.undo(undo2!);

      expect(historyManager.canRedo()).toBe(true);

      const redo1 = historyManager.redo(undo3!);
      expect(redo1).not.toBeNull();

      const redo2 = historyManager.redo(redo1!);
      expect(redo2).not.toBeNull();
    });

    it('should return null when redoStack is exhausted', () => {
      historyManager.saveState(mockMemento1);
      historyManager.saveState(mockMemento2);

      const currentState = new GraphMemento([], [], []);
      historyManager.undo(currentState);
      historyManager.redo(currentState);

      const result = historyManager.redo(currentState);
      expect(result).toBeNull();
    });
  });

  describe('reset', () => {
    it('should clear undoStack', () => {
      historyManager.saveState(mockMemento1);
      historyManager.saveState(mockMemento2);
      expect(historyManager.canUndo()).toBe(true);

      historyManager.reset();
      expect(historyManager.canUndo()).toBe(false);
    });

    it('should clear redoStack', () => {
      historyManager.saveState(mockMemento1);
      historyManager.saveState(mockMemento2);

      const currentState = new GraphMemento([], [], []);
      historyManager.undo(currentState);
      expect(historyManager.canRedo()).toBe(true);

      historyManager.reset();
      expect(historyManager.canRedo()).toBe(false);
    });

    it('should clear both stacks simultaneously', () => {
      historyManager.saveState(mockMemento1);
      historyManager.saveState(mockMemento2);

      const currentState = new GraphMemento([], [], []);
      historyManager.undo(currentState);

      expect(historyManager.canUndo()).toBe(true);
      expect(historyManager.canRedo()).toBe(true);

      historyManager.reset();

      expect(historyManager.canUndo()).toBe(false);
      expect(historyManager.canRedo()).toBe(false);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle undo-redo cycle correctly', () => {
      historyManager.saveState(mockMemento1);
      historyManager.saveState(mockMemento2);
      historyManager.saveState(mockMemento3);

      // Undo twice
      const undo1 = historyManager.undo(mockMemento3);
      const undo2 = historyManager.undo(undo1!);

      // Redo once
      const redo1 = historyManager.redo(undo2!);
      expect(redo1).not.toBeNull();

      // Undo again
      const undo3 = historyManager.undo(redo1!);

      // Should be able to redo
      expect(historyManager.canRedo()).toBe(true);
    });

    it('should handle save after undo correctly', () => {
      historyManager.saveState(mockMemento1);
      historyManager.saveState(mockMemento2);
      historyManager.saveState(mockMemento3);

      const undo1 = historyManager.undo(mockMemento3);
      const undo2 = historyManager.undo(undo1!);

      // redo stack should have items
      expect(historyManager.canRedo()).toBe(true);

      // Save new state
      const newMemento = new GraphMemento(
        [{ id: 99, label: 'new' }],
        [],
        [
          {
            id: 99,
            name: 'new',
            feature: 'test',
            library: 'pytorch',
            framework: 'pytorch',
            codeId: 'cn',
            inport: 1,
            outport: 1,
            parameters: [],
            code: 'new',
          },
        ],
      );

      historyManager.saveState(newMemento);

      // redo stack should be cleared
      expect(historyManager.canRedo()).toBe(false);

      // undo should return the branching path
      const undoResult = historyManager.undo(newMemento);
      expect(undoResult).not.toBeNull();
    });

    it('should maintain history correctly with many operations', () => {
      const mementos: GraphMemento[] = [];

      // Create 10 states
      for (let i = 0; i < 10; i++) {
        const memento = new GraphMemento(
          [{ id: i, label: `node${i}` }],
          [],
          [
            {
              id: i,
              name: `layer${i}`,
              feature: 'test',
              library: 'pytorch',
              framework: 'pytorch',
              codeId: `c${i}`,
              inport: i,
              outport: i,
              parameters: [],
              code: `code${i}`,
            },
          ],
        );
        mementos.push(memento);
        historyManager.saveState(memento);
      }

      // Undo all the way
      const currentState = new GraphMemento([], [], []);
      for (let i = 0; i < 10; i++) {
        expect(historyManager.canUndo()).toBe(true);
        historyManager.undo(currentState);
      }

      expect(historyManager.canUndo()).toBe(false);
      expect(historyManager.canRedo()).toBe(true);

      // Redo all the way
      for (let i = 0; i < 10; i++) {
        expect(historyManager.canRedo()).toBe(true);
        historyManager.redo(currentState);
      }

      expect(historyManager.canRedo()).toBe(false);
      expect(historyManager.canUndo()).toBe(true);
    });
  });
});
