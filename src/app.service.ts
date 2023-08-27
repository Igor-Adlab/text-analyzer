import OpenAI from 'openai';
import { first } from 'lodash';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { Env } from './env';
import { SchemaBuilder } from './utils/schema-builder';
import { ExtrationRequestDto } from './dtos/extraction-request.dto';

@Injectable()
export class AppService {
  openai: OpenAI;
  logger = new Logger(AppService.name);

  constructor(
    private readonly config: ConfigService
  ) {
    this.openai = new OpenAI({
      apiKey: this.config.get(Env.OpenAiAccessKey),
      organization: this.config.get(Env.OpenAiOrganizationId),
    });
  }

  async extract(dto: ExtrationRequestDto): Promise<any> {
    const schema = dto.entities
      .map((entity) => SchemaBuilder.create(entity).build())
      .join('\n');

    const prompt = this.getPrompt(dto.text, schema);
    const completion = await this.openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
    });

    const raw = first(completion.choices)?.message?.content?.replace(/\n/, '');
    if(!raw) {
      throw new NotFoundException(`Can not parse parameters from text...`);
    }

    let result = {}
    try {
      result = JSON.parse(raw);
    } catch(e) {
      this.logger.error(`Can not parse JSON: ${e.message} | Raw: ${raw}`);
    }

    return result;
  }

  private getPrompt(text: string, schema: string) {
    return `analyze and parse this text: "${text}", then provide response in JSON format by following schema:\n${schema}`;
  }
}
