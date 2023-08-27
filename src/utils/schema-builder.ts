import { pad } from 'lodash';
import {
  EntityValueType,
  ExtractionEntity,
} from 'src/dtos/extraction-request.dto';

export class SchemaBuilder {
  constructor(
    private readonly entity: ExtractionEntity,
    private readonly offset: number = 1,
  ) {}

  build() {
    const spacing = pad('', this.offset, '*');
    let template = `${spacing} Object key: ${
      this.entity.key
    } | Value type: ${this.entity.type.toString()} | Description: ${
      this.entity.notes
    }`;
    if (
      Array.isArray(this.entity.schema) &&
      (this.entity.type === EntityValueType.Array ||
        this.entity.type === EntityValueType.Object)
    ) {
      const nested = this.entity.schema.map(entity => SchemaBuilder.create(entity, this.offset + 1).build()).join("\n"); 
      return `${template} | Nested entity: \n${nested}`;
    }

    if (this.entity.examples) {
      const examples = this.entity.examples.join(', ');
      template += ` | Examples: ${examples}`;
    }

    if (this.offset == 1) {
      template += `\n`;
    }

    return template;
  }

  public static create(entity: ExtractionEntity, offset = 1) {
    return new SchemaBuilder(entity, offset);
  }
}
