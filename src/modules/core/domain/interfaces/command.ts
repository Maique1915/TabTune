export interface Command {
    id: string;
    execute(): void;
    undo(): void;
}

export interface CommandHistory {
    execute(command: Command): void;
    undo(): void;
    redo(): void;
    canUndo: boolean;
    canRedo: boolean;
}
