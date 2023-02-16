import { Controller } from '@nestjs/common';
import { AdminProfitService } from './admin-profit.service';

@Controller('admin-profit')
export class AdminProfitController {
    constructor(private readonly adminProfitService: AdminProfitService) {}
}
