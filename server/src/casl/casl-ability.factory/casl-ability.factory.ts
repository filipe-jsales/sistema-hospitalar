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

    // can(Action.Read, Hospital, { id: user.hospital.id });
    user.roles?.forEach((role: Role) => {
      console.log('Role Permissions:', role.permissions);
      role.permissions?.forEach((permission: Permission) => {
        console.log('Permission:', permission);
        const action = permission.action as Action;
        const subject = subjectMapping[permission.subject];

        console.log(`Checking permission: ${action} on ${permission.subject}`);

        if (action && subject) {
          console.log(
            `Granting permission: can(${action}, ${subject.name || subject})`,
          );
          can(action, subject);
        } else {
          console.log(`No valid action or subject found for permission.`);
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
