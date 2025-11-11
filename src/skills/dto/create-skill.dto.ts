import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsOptional, IsString } from 'class-validator';
import { Prisma } from 'src/prisma/generated/client';

export class CreateSkillDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty()
    @IsJSON()
    details: Prisma.JsonValue;
}
