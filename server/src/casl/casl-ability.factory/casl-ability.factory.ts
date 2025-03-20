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
import { Role } from '../../roles/entities/role.entity';
import { Permission } from '../../permissions/entities/permission.entity';
import { Hospital } from 'src/hospitals/entities/hospital.entity';

const subjectMapping: Record<string, any> = {
  User: User,
  Role: Role,
  Permission: Permission,
  Hospital: Hospital,
};

type Subjects = InferSubjects<
  typeof User | typeof Role | typeof Permission | typeof Hospital | 'all'
>;
export type AppAbility = MongoAbility<[Action, Subjects]>;
@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User): AppAbility {
    const { can, cannot, build } = new AbilityBuilder<
      MongoAbility<[Action, Subjects]>
    >(createMongoAbility);

    const isSuperAdmin = user.roles?.some(role => role.name === 'superadmin');
    if (isSuperAdmin) {
      can(Action.Manage, 'all');
    } 
    else if (user.hospital) {
      can(Action.Read, Hospital, { id: user.hospital.id });
    }
    user.roles?.forEach((role: Role) => {
      role.permissions?.forEach((permission: Permission) => {
        const action = permission.action as Action;
        const subject = subjectMapping[permission.subject];

        if (action && subject) {
          if (!isSuperAdmin && subject === Hospital && user.hospital) {
            can(action, subject, { id: user.hospital.id });
          } else {
            can(action, subject);
          }
        }
      });
    });

    cannot(Action.Delete, User).because('Deletion is restricted.');

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}