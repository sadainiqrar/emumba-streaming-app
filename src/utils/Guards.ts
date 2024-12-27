import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Role } from './enums';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const params = request.params;

    if (user.role === Role.User && user.id === +params.id) {
      return true;
    }

    if (user.role === Role.Admin) {
      return true;
    }

    throw new ForbiddenException('You can only access your own record.');
  }
}