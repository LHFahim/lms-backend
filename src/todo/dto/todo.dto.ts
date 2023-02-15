import { PartialType, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PaginationQueryDto } from '../../common';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { TodoEntity } from './../entities/todo.entity';

export class CreateTodoDto extends PickType(TodoEntity, ['title', 'description', 'type']) {}
export class UpdateTodoDto extends PartialType(CreateTodoDto) {}

// query dto
export class TodoPaginatedQueryDto extends PaginationQueryDto {}

// response dto
export class TodoDto extends TodoEntity {}
export class TodoPaginatedDto {
    @Expose()
    items: TodoDto[];

    @Expose()
    pagination: PaginationDto;
}
