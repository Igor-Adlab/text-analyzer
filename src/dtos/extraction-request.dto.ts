import { snakeCase } from "lodash";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsOptional, IsString, MaxLength, ValidateNested } from "class-validator";

import { MaxDepthValidator } from "src/validators/max-object.depth.validator";

export enum EntityValueType {
    Float = 'float',
    String = 'string',
    Integer = 'integer',
    Boolean = 'boolean',

    Array = 'array',
    Object = 'object',
}

export class ExtractionEntity {
    @IsString()
    @Transform(({ value }) => snakeCase(value))
    @ApiProperty({
        required: true,
        example: 'integer',
        enum: EntityValueType,
    })
    type: EntityValueType;
    
    @IsString()
    @Transform(({ value }) => snakeCase(value))
    @ApiProperty({
        type: String,
        required: true,
        example: 'price',
    })
    key: string;

    @IsString()
    @ApiProperty({
        type: String,
        required: true,
        example: 'rent price',
    })
    notes: string;

    @IsOptional()
    @ApiProperty({
        type: String,
        example: null,
        required: true,
    })
    examples: any[]

    @IsOptional()
    @ValidateNested()
    @Type(() => ExtractionEntity)
    @ApiProperty({
        example: null,
        isArray: true,
        required: false,
        type: () => ExtractionEntity,
    })
    schema: ExtractionEntity[];
}

export class ExtrationRequestDto {
    @IsString()
    @MaxLength(10 * 1000) // TODO: investigate response time for larger texts
    @ApiProperty({
        type: String,
        required: true,
        example: 'A beautiful 3200 square foot house in Santa Barbara, California for rent. $5,300 a month.',
    })
    text: string;

    @MaxDepthValidator(10, true)
    @Type(() => ExtractionEntity)
    @ValidateNested({ each: true })
    @ApiProperty({
        maxItems: 25,
        isArray: true,
        type: () => ExtractionEntity
    })
    entities: ExtractionEntity[];
}
