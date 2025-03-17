// 1. Primeiro, vamos criar um serviço de inicialização para configurar permissões padrão
// Crie um arquivo: src/permissions/permission-seed.service.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
import { PermissionsService } from '../permissions.service';
import { RolesService } from 'src/roles/roles.service';
import { Action } from 'src/casl/casl-ability.factory/action.enum';

@Injectable()
export class PermissionSeedService implements OnModuleInit {
  constructor(
    private readonly permissionsService: PermissionsService,
    private readonly rolesService: RolesService,
  ) {}

  async onModuleInit() {
    await this.createDefaultPermissions();
  }

  async createDefaultPermissions() {
    const userRole = await this.rolesService.findByName('user');
    
    if (!userRole) {
      console.error('Papel "user" não encontrado. As permissões não foram criadas.');
      return;
    }

    const defaultPermissions = [
      {
        name: 'read:profile',
        description: 'Permite ao usuário ler seu próprio perfil',
        userDescription: 'Visualizar perfil',
        action: Action.Read,
        subject: 'User',
        roles: [userRole.id],
      },
      {
        name: 'update:profile',
        description: 'Permite ao usuário atualizar seu próprio perfil',
        userDescription: 'Editar perfil',
        action: Action.Update,
        subject: 'User',
        roles: [userRole.id],
      },
      {
        name: 'read:hospital',
        description: 'Permite ao usuário visualizar informações do hospital',
        userDescription: 'Visualizar hospital',
        action: Action.Read,
        subject: 'Hospital',
        roles: [userRole.id],
      },
    ];

    for (const permissionData of defaultPermissions) {
      try {
        const existingPermissions = await this.permissionsService.findAll();
        const exists = existingPermissions.some(p => p.name === permissionData.name);
        
        if (!exists) {
          await this.permissionsService.create(permissionData);
          console.log(`Permissão "${permissionData.name}" criada com sucesso.`);
        }
      } catch (error) {
        console.error(`Erro ao criar permissão "${permissionData.name}":`, error.message);
      }
    }
  }
}