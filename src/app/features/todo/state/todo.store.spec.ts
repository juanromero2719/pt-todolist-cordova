import { TodoStore } from './todo.store';
import { firstValueFrom } from 'rxjs';

describe ('TodoStore', () => {
    it('filters tasks by selected category', async () => {
        const store = new TodoStore();

        store.setTasks([
            { id: '1', title: 'A', category: 'work', status: 'pending', createdAt: Date.now() },
            { id: '2', title: 'B', category: 'home', status: 'pending', createdAt: Date.now() },
        ]);

        store.setCategory('work');

        const visible = await firstValueFrom(store.visibleTasks$);
        expect(visible.map(task => task.id)).toEqual(['1']);

    });
});