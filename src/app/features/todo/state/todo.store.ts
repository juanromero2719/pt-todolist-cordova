import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map, distinctUntilChanged, shareReplay, take } from "rxjs/operators";
import { Task } from "../../../core/domain/task.model";
import { LocalTaskRepository } from "../../../core/infraestructure/local-task.repository";
import { LoadTasksUseCase, AddTaskUseCase, ToggleTaskDoneUseCase, DeleteTaskUseCase } from "../../../core/application/todo.usecases";

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

    private readonly loadUC = new LoadTasksUseCase(this.taskRepository);
    private readonly addUC = new AddTaskUseCase(this.taskRepository);
    private readonly toggleUC = new ToggleTaskDoneUseCase(this.taskRepository);
    private readonly deleteUC = new DeleteTaskUseCase(this.taskRepository);

    constructor(private readonly taskRepository: LocalTaskRepository) {}

    readonly tasks$: Observable<Task[]> = this.state$.pipe(
        map(state => state.tasks),
        distinctUntilChanged((prev, curr) => prev.length === curr.length && prev.every((t, i) => t.id === curr[i]?.id && t.status === curr[i]?.status)),
        shareReplay(1)
    );

    readonly selectedCategory$: Observable<string | null> = this.state$.pipe(
        map(state => state.selectedCategory),
        distinctUntilChanged(),
        shareReplay(1)
    );

    readonly categories$: Observable<string[]> = this.state$.pipe(
        map(state => Array.from(new Set(state.tasks.map(task => task.category))).sort()),
        distinctUntilChanged((prev, curr) => prev.length === curr.length && prev.every((c, i) => c === curr[i])),
        shareReplay(1)
    );

    readonly visibleTasks$: Observable<Task[]> = this.state$.pipe(
        map(state => (state.selectedCategory ? state.tasks.filter(task => task.category === state.selectedCategory) : state.tasks)),
        distinctUntilChanged((prev, curr) => prev.length === curr.length && prev.every((t, i) => t.id === curr[i]?.id && t.status === curr[i]?.status)),
        shareReplay(1)
    );

    load() {
        this.loadUC.execute().pipe(take(1)).subscribe(tasks => this.patch({ tasks }));
    }
    
    add(title: string, category: string) {
        this.addUC.execute(title, category).pipe(take(1)).subscribe(tasks => this.patch({ tasks }));
    }

    toggleDone(id: string) {
        this.toggleUC.execute(id).pipe(take(1)).subscribe(tasks => this.patch({ tasks }));
    }

    remove(id: string) {
        this.deleteUC.execute(id).pipe(take(1)).subscribe(tasks => this.patch({ tasks }));
    }
    
    setCategory(category: string | null) {
        this.patch({ selectedCategory: category });
    }

    private patch(patch: Partial<TodoState>) {
        const current = this.state$.value;
        this.state$.next({ ...current, ...patch });
    }
}