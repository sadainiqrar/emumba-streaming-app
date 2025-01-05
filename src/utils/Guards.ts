import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Socket } from 'socket.io';
import { verify } from 'jsonwebtoken';
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

@Injectable()
export class WebSocketJwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (context.getType() !== 'ws') {
      return true
    }

    const client: Socket = context.switchToWs().getClient();
    WebSocketJwtGuard.validateToken(client);

    return true
  } 

  static validateToken(client: Socket) {
    const { authorization } = client.handshake.headers
    const token: string = authorization.split(' ')[1];
    const payload = verify(token, process.env.JWT_SECRET);
    
    return payload
  }
}