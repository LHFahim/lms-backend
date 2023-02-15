import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Serialize, UserId } from '../../libs/utils/src';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { APIVersions, ControllersEnum, Routes } from '../common';
import { ResourceId } from './../../libs/utils/src/request/validate-resource-ids.decorator';
import { CreateTodoDto, TodoPaginatedQueryDto, UpdateTodoDto } from './dto/todo.dto';
import { TodoService } from './todo.service';

@ApiTags('Todo')
@Serialize()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: ControllersEnum.Todo, version: APIVersions.V1 })
export class TodoController {
    constructor(private readonly todoService: TodoService) {}

    @Post(Routes[ControllersEnum.Todo].createTodo)
    createTodo(@UserId() userId: string, @Body() body: CreateTodoDto) {
        return this.todoService.createTodo(userId, body);
    }

    @Get(Routes[ControllersEnum.Todo].getTodos)
    getTodos(@UserId() userId: string, @Query() query: TodoPaginatedQueryDto) {
        return this.todoService.getTodos(userId, query);
    }

    @Get(Routes[ControllersEnum.Todo].getOneTodo)
    getOneTodo(@UserId() userId: string, @ResourceId() id: string) {
        return this.todoService.getOneTodo(userId, id);
    }

    @Patch(Routes[ControllersEnum.Todo].modifyTodo)
    modifyTodo(@UserId() userId: string, @ResourceId() id: string, @Body() body: UpdateTodoDto) {
        return this.todoService.update(userId, id, body);
    }

    @Delete(Routes[ControllersEnum.Todo].deleteTodo)
    deleteTodo(@UserId() userId: string, @ResourceId() id: string) {
        return this.todoService.deleteTodo(userId, id);
    }

    @Patch(Routes[ControllersEnum.Todo].markTodoComplete)
    markTodoComplete(@UserId() userId: string, @ResourceId() id: string) {
        return this.todoService.markTodoComplete(userId, id);
    }
}
