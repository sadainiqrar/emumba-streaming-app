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
    try {
      const { authorization } = client.handshake.headers

      // Log for debugging
      console.log('WebSocketJwtGuard: Validating token from headers:', {
        headers: client.handshake.headers,
        hasAuthorization: !!authorization
      });

      if (!authorization) {
        console.error('WebSocketJwtGuard: No authorization header found');
        throw new ForbiddenException('You are not authorized to access this resource.');
      }

      // Check if the authorization header has the correct format
      const parts = authorization.split(' ');
      if (parts.length !== 2 || parts[0] !== 'Bearer') {
        console.error('WebSocketJwtGuard: Invalid authorization header format');
        throw new ForbiddenException('Invalid authorization header format');
      }

      const token: string = parts[1];
      if (!token) {
        console.error('WebSocketJwtGuard: Token is empty');
        throw new ForbiddenException('Invalid token');
      }

      // Verify the token
      const payload = verify(token, process.env.JWT_SECRET || 'secretKey');
      console.log('WebSocketJwtGuard: Token verified successfully', { userId: payload.id });

      return payload;
    } catch (error) {
      console.error('WebSocketJwtGuard: Token validation error', error);
      throw new ForbiddenException('Invalid token: ' + (error.message || 'Unknown error'));
    }
  }
}