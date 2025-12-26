import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { TodoStore } from "../state/todo.store";
import { SoundService } from "../../../core/services/sound.service";
import { FirebaseRemoteConfigFlags } from '../../../core/infraestructure/firebase-remote-config.flags';
import { FeatureFlags } from '../../../core/application/feature-flags';

@Component({
    selector: 'app-todo',
    templateUrl: './todo.page.html',
    styleUrls: ['./todo.page.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, IonicModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoPage implements OnInit {
    
    tasks$ = this.store.visibleTasks$;
    categories$ = this.store.categories$;
    selectedCategory$ = this.store.selectedCategory$;
    removingTaskId: string | null = null;

    form = this.fb.group({
        title: ['', [Validators.required, Validators.minLength(2)]],
        category: ['', [Validators.required]],
    });    

    constructor(
        private readonly store: TodoStore, 
        private readonly fb: FormBuilder,
        private readonly soundService: SoundService,
        public readonly flags: FirebaseRemoteConfigFlags,
        private readonly cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.store.load();
    }

    addTask() {
        const title = this.form.value.title ?? '';
        const category = this.form.value.category ?? 'general';
        if(this.form.invalid) {
            this.soundService.playClick();
            return;
        }
        this.soundService.playSuccess();
        this.store.add(title, category);
        this.form.patchValue({ title: '', category: '' });
    }

    filter(category: string | null) {
        this.soundService.playClick();
        this.store.setCategory(category);
    }
    
    toggle(id: string) {
        this.soundService.playComplete();
        this.store.toggleDone(id);
    }

    remove(id: string) {
        this.removingTaskId = id;
        this.soundService.playDelete();
        this.cdr.markForCheck();
        
        setTimeout(() => {
            this.store.remove(id);
            this.removingTaskId = null;
            this.cdr.markForCheck();
        }, 300);
    }
    
    isRemoving(id: string): boolean {
        return this.removingTaskId === id;
    }
    
    trackByTaskId(index: number, task: any): string {
        return task.id;
    }
}