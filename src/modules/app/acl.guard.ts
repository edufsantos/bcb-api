import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

const allowedPermissions = [
  '/auth',
  '/acl',
  '/registrations',
  '/users/current GET',
];

@Injectable()
export class AclGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request?.user?.id;
    const path = request.route.path;
    const method = request.route.stack[0].method.toUpperCase();
    const permissionName = `${path} ${method}`;

    if (
      allowedPermissions.find((allowedPermission) =>
        permissionName.startsWith(allowedPermission),
      )
    )
      return true;
    if (await this.hasProfile(userId, permissionName)) return true;
    return false;
  }

  async hasProfile(userId: string, permissionName: string) {
    const profiles = await this.prisma.profile.findMany({
      where: {
        users: { some: { id: userId } },
      },
    });
    return profiles.find((profile) => {
      return (profile.permissions as Array<string>).find((permission) =>
        permissionName.startsWith(permission),
      );
    });
  }
}
