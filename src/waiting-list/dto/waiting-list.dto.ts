import { PartialType, PickType } from '@nestjs/swagger';
import { WaitingListEntity } from '../entities/waiting-list.entity';

export class CreateWaitingListDto extends PickType(WaitingListEntity, ['book']) {}
export class UpdateWaitingListDto extends PartialType(CreateWaitingListDto) {}

// response
export class WaitingListDto extends WaitingListEntity {}
