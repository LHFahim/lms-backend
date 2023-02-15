import { Injectable, NotFoundException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { SerializeService } from '../../libs/utils/src/serializer/serialize.service';
import { CreateTodoDto, TodoDto, TodoPaginatedDto, TodoPaginatedQueryDto, UpdateTodoDto } from './dto/todo.dto';
import { TodoEntity } from './entities/todo.entity';

@Injectable()
export class TodoService extends SerializeService<TodoEntity> {
    constructor(@InjectModel(TodoEntity) private readonly todoModel: ReturnModelType<typeof TodoEntity>) {
        super(TodoEntity);
    }

    async createTodo(userId: string, body: CreateTodoDto) {
        const doc = await this.todoModel.create({ ...body, completed: false, isDeleted: false, createdBy: userId });

        return this.toJSON(doc, TodoDto);
    }

    async getTodos(userId: string, query: TodoPaginatedQueryDto): Promise<TodoPaginatedDto> {
        const docs = await this.todoModel
            .find({ id: userId })
            .sort({ [query.sortBy]: query.sort })
            .limit(query.pageSize)
            .skip((query.page - 1) * query.pageSize);

        if (!docs) throw new NotFoundException('Todos are not found');

        const docsCount = await this.todoModel.count({ id: userId });

        return {
            items: this.toJSONs(docs, TodoDto),
            pagination: {
                total: docsCount,
                current: query.page,
                previous: query.page === 1 ? 1 : query.page - 1,
                next: docs.length > query.page * query.pageSize ? query.page + 1 : query.page,
            },
        };
    }

    async getOneTodo(userId: string, id: string): Promise<TodoDto> {
        const doc = await this.todoModel.findOne({ _id: id, createdBy: userId });

        if (!doc) throw new NotFoundException('Todo is not found');

        return this.toJSON(doc, TodoDto);
    }

    async update(userId: string, id: string, body: UpdateTodoDto): Promise<TodoDto> {
        const doc = await this.todoModel.findOneAndUpdate({ _id: id, createdBy: userId }, { ...body }, { new: true });
        if (!doc) throw new NotFoundException('Todo is not found');

        return this.toJSON(doc, TodoDto);
    }

    async deleteTodo(userId: string, id: string): Promise<TodoDto> {
        const doc = await this.todoModel.findOneAndDelete({ _id: id, createdBy: userId }, { new: true });
        if (!doc) throw new NotFoundException('Todo is not found');

        return this.toJSON(doc, TodoDto);
    }

    async markTodoComplete(userId: string, id: string): Promise<TodoDto> {
        const doc = await this.todoModel.findOneAndUpdate(
            { _id: id, createdBy: userId },
            { completed: true },
            { new: true },
        );

        if (!doc) throw new NotFoundException('Todo is not found');

        return this.toJSON(doc, TodoDto);
    }
}
