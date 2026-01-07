import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo } from './entities/todo.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TodosService {
    private todos: Todo[] = [];

    findAll(search?: string): Todo[] {
        if (search) {
            return this.todos.filter((todo) =>
                todo.title.toLowerCase().includes(search.toLowerCase()),
            );
        }
        return this.todos;
    }

    create(createTodoDto: CreateTodoDto): Todo {
        const newTodo: Todo = {
            id: uuidv4(),
            title: createTodoDto.title,
            completed: false,
        };
        this.todos.push(newTodo);
        return newTodo;
    }

    toggle(id: string): Todo {
        const todo = this.todos.find((t) => t.id === id);
        if (!todo) {
            throw new NotFoundException(`Todo with ID ${id} not found`);
        }
        todo.completed = !todo.completed;
        return todo;
    }
}
