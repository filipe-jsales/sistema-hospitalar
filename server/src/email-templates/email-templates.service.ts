import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as handlebars from 'handlebars';

@Injectable()
export class EmailTemplatesService {
  private getTemplate(templateName: string): string {
    const templatePath = join(process.cwd(), 'src/email-templates/templates', `${templateName}.hbs`);
    return readFileSync(templatePath, 'utf-8');
  }

  public compile(templateName: string, data: any): string {
    const template = this.getTemplate(templateName);
    const compiledTemplate = handlebars.compile(template);
    return compiledTemplate(data);
  }

  public getActivationEmail(firstName: string, activationLink: string): string {
    return this.compile('activation', { firstName, activationLink, year: new Date().getFullYear() });
  }
}