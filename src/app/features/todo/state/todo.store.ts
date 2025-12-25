import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Task } from "../../../core/domain/task.model";

export interface TodoState {
    tasks: Task[];
    selectedCategory: string | null	;
}

const initialState: TodoState = {
    tasks: [],
    selectedCategory: null
}

@Injectable({ providedIn: 'root'})
export class TodoStore {
    private readonly state$ = new BehaviorSubject<TodoState>(initialState); 

    readonly tasks$: Observable<Task[]> = this.state$.pipe(map(state => state.tasks));
    readonly selectedCategory$: Observable<string | null> = this.state$.pipe(map(state => state.selectedCategory));

    readonly visibleTasks$: Observable<Task[]> = this.state$.pipe(
        map(state => {
            if (!state.selectedCategory) return state.tasks;
            return state.tasks.filter(task => task.category === state.selectedCategory);
        })
    );
    
    setCategory(category: string | null) {
        this.patch({ selectedCategory: category });
    }

    setTasks(tasks: Task[]) {
        this.patch({ tasks });
    }

    private patch(patch: Partial<TodoState>) {
        const current = this.state$.value;
        this.state$.next({ ...current, ...patch });
    }
}