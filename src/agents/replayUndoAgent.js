export class ReplayUndoAgent {
  constructor() {
    this.actions = [];
  }

  record(action) {
    this.actions.push({ at: Date.now(), ...action });
  }

  undo() {
    return this.actions.pop() ?? null;
  }

  exportReplay() {
    return {
      version: 1,
      actions: this.actions
    };
  }
}
