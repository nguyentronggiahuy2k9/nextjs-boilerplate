// THIS IS AN INSECURE IN-MEMORY STORE FOR DEMO PURPOSES ONLY.
// In a real application, you would use a secure, persistent database on the server.

interface Task {
    id: string;
    token: string;
    destinationUrl: string;
}

class TaskStore {
    private store: Map<string, Task>;

    constructor() {
        this.store = new Map();
    }

    set(taskId: string, task: Task): void {
        this.store.set(taskId, task);
    }

    get(taskId: string): Task | undefined {
        return this.store.get(taskId);
    }

    delete(taskId: string): void {
        this.store.delete(taskId);
    }
}

// We create a singleton instance that will be shared across the client-side application.
export const taskStore = new TaskStore();
