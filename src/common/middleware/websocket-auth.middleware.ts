import { Socket } from 'socket.io'
import { WebSocketJwtGuard } from 'src/utils/Guards'

export type WebSocketIOMiddleware = {
  (client: Socket, next: (err?: Error) => void);
}

export const WebSocketAuthMiddleware = (): WebSocketIOMiddleware => {
  return (client, next) => {
    try {
      WebSocketJwtGuard.validateToken(client);
      next();
    } catch (error) {
      next(error);
    }
  }
}