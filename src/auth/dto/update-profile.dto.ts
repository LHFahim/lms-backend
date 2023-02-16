import { UserEntity } from 'src/user/entities/user.entity';

import { PickType } from '@nestjs/swagger';

export class UpdateProfileDto extends PickType(UserEntity, ['firstName', 'lastName', 'walletId']) {}
