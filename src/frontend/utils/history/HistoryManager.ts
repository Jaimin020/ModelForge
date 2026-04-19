import { GraphMemento } from './GraphMemento';

export class HistoryManager {
  private undoStack: GraphMemento[] = [];
  private redoStack: GraphMemento[] = [];
  private maxHistory: number = 50; // max depth

  public saveState(memento: GraphMemento): void {
    this.undoStack.push(memento);
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
    // Action overrides any prior undone actions
    this.redoStack = [];
  }

  public canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  public canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  public undo(currentState: GraphMemento): GraphMemento | null {
    if (!this.canUndo()) return null;
    this.redoStack.push(currentState);
    return this.undoStack.pop() || null;
  }

  public redo(currentState: GraphMemento): GraphMemento | null {
    if (!this.canRedo()) return null;
    this.undoStack.push(currentState);
    return this.redoStack.pop() || null;
  }

  public reset(): void {
    this.undoStack = [];
    this.redoStack = [];
  }
}
