import { SetMetadata} from '@nestjs/common';
export const ROLE_KEY = 'role';
//contain metadata for role
export const Roles = (...roles: string[]) => {
    return SetMetadata(ROLE_KEY, roles);
}

