import { Module } from '@nestjs/common';
import { AdminAuthModule } from './admin-auth/auth.module';
import { AdminBookModule } from './admin-book/admin-book.module';
import { AdminClientModule } from './admin-client/admin-client.module';
import { AdminUserModule } from './admin-user/admin-user.module';
import { AdminWalletModule } from './admin-wallet/admin-wallet.module';

@Module({
    imports: [AdminUserModule, AdminClientModule, AdminAuthModule, AdminBookModule, AdminWalletModule],
})
export class AdminModule {}
