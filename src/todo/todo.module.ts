import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { TodoEntity } from './entities/todo.entity';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
    imports: [TypegooseModule.forFeature([TodoEntity])],
    controllers: [TodoController],
    providers: [TodoService],
})
export class TodoModule {}
