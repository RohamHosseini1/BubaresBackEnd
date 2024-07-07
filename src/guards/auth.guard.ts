import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'

// set @Public decorator
import { SetMetadata } from '@nestjs/common'
export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)
// ---

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    // routes decorated by @Public()
    if (isPublic) return true

    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)

    // no token
    if (!token) throw new UnauthorizedException()

    // invalid token
    const payload = await this.jwtService.verifyAsync(token).catch(() => {
      throw new UnauthorizedException()
    })

    // add user information to request
    request['user'] = payload

    // pass
    return true
  }

  private extractTokenFromHeader(request: Request & { headers: { authorization: string } }): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
