import { Serialize } from '@app/utils/serializer/serializer.decorator';
import { applyDecorators, Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { APIVersions, ControllersEnum } from '../enums';

export const ApiController = (
  path: ControllersEnum,
  apiTag = '',
  version: APIVersions = APIVersions.V1,
) =>
  applyDecorators(
    // Serialize(),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard),
    ApiTags(apiTag),
    Controller({ path, version }),
  );
