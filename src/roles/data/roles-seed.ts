import { Types } from 'mongoose';

import { Roles } from '../../common';
import { RoleSeed } from '../interfaces/role-seed.interface';

export const RoleSeedData: RoleSeed[] = [
    {
        id: new Types.ObjectId('62d55182bdfb546d79bb1000'),
        name: Roles.OWNER,
        displayName: 'Administrator',
        description: 'All rights to manage everything',
        // assigning all permissions
        permissions: [],
    },
    {
        id: new Types.ObjectId('62d55182bdfb546d79bb1001'),
        name: Roles.ADMIN,
        displayName: 'ADMIN',
        description: 'Limited access to manage administrative works',
        permissions: [],
    },

    {
        id: new Types.ObjectId('62d55182bdfb546d79bb1005'),
        name: Roles.MEMBER,
        displayName: 'User',
        description: 'App User access',
        permissions: [],
    },
];

export const getIdForUserRole = () => RoleSeedData.find((role) => role.name === Roles.MEMBER)?.id as Types.ObjectId;
export const getIdForAdminRole = () => RoleSeedData.find((role) => role.name === Roles.ADMIN)?.id as Types.ObjectId;
