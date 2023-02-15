import { Param } from '@nestjs/common';
import { ParseMongoID } from '@app/utils';

export const CompanyId = () => Param('companyId', ParseMongoID);
export const ResourceId = (name = 'id') => Param(name, ParseMongoID);
