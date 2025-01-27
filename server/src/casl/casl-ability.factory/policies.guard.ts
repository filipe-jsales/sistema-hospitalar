import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory, AppAbility } from './casl-ability.factory';
import { CHECK_POLICIES_KEY, IS_PUBLIC_KEY } from './policies.decorator';
import { PolicyHandler } from './policy-handler.interface';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const handlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const request = context.switchToHttp().getRequest();
    const user = request.body.user;
    //console.log(request.body.user);
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const ability = this.caslAbilityFactory.createForUser(user);

    return handlers.every((handler) =>
      this.executePolicyHandler(handler, ability),
    );
  }

  private executePolicyHandler(
    handler: PolicyHandler,
    ability: AppAbility,
  ): boolean {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
