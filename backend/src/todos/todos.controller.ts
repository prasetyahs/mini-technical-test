import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Query,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';

@Controller('todos')
export class TodosController {
    constructor(private readonly todosService: TodosService) { }

    @Get()
    findAll(@Query('search') search: string) {
        try {
            const data = this.todosService.findAll(search);
            return {
                data,
                status: true,
                message: 'berhasil mendapatkan data',
            };
        } catch (error) {
            return {
                data: [],
                status: false,
                message: 'terjadi kesalahan',
            };
        }
    }

    @Post()
    create(@Body() createTodoDto: CreateTodoDto) {
        try {
            const data = this.todosService.create(createTodoDto);
            return {
                data,
                status: true,
                message: 'berhasil menambahkan data',
            };
        } catch (error) {
            return {
                data: null,
                status: false,
                message: 'terjadi kesalahan',
            };
        }
    }

    @Patch(':id')
    toggle(@Param('id') id: string) {
        try {
            const data = this.todosService.toggle(id);
            return {
                data,
                status: true,
                message: 'berhasil mengubah data',
            };
        } catch (error) {
            return {
                data: null,
                status: false,
                message: 'terjadi kesalahan',
            };
        }
    }
}
