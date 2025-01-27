import {
  createMongoAbility,
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action } from './action.enum';
import { User } from '../../users/entities/user.entity';

type Subjects = InferSubjects<typeof User | 'all'>;
export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User): AppAbility {
    const { can, cannot, build } = new AbilityBuilder<
      MongoAbility<[Action, Subjects]>
    >(createMongoAbility);

    if (user.role === 'super-admin') {
      can(Action.Manage, 'all');
    } else if (user.role === 'admin') {
      can(Action.Manage, User);
    } else {
      can(Action.Read, User, { id: user.id });
    }

    cannot(Action.Delete, User).because('Deletion is restricted.');

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
