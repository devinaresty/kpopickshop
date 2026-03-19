import { Injectable, CanActivate, ExecutionContext, ForbiddenException, } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      throw new ForbiddenException("No role information provided");
    }

    const userRole = user.role.toLowerCase();
    const hasRole = requiredRoles.some(role => role.toLowerCase() === userRole);

    if (!hasRole) {
      throw new ForbiddenException(
        `User role '${user.role}' does not have access to this resource. Required roles: ${requiredRoles.join(", ")}`
      );
    }

    return true;
  }
}
