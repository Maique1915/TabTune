import { Command, CommandHistory } from '../domain/interfaces/command';

export class CommandManager implements CommandHistory {
    private history: Command[] = [];
    private redoStack: Command[] = [];

    execute(command: Command): void {
        command.execute();
        this.history.push(command);
        this.redoStack = []; // Clear redo stack on new command
    }

    undo(): void {
        const command = this.history.pop();
        if (command) {
            command.undo();
            this.redoStack.push(command);
        }
    }

    redo(): void {
        const command = this.redoStack.pop();
        if (command) {
            command.execute();
            this.history.push(command);
        }
    }

    get canUndo(): boolean {
        return this.history.length > 0;
    }

    get canRedo(): boolean {
        return this.redoStack.length > 0;
    }
}
