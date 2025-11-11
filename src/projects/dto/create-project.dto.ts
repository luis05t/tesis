import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty() // <-- Añadido para seguridad
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty() // <-- Añadido para seguridad
  description: string;

  @ApiProperty({ required: false, default: 'in-progress' })
  @IsString()
  @IsOptional() // <-- CORREGIDO: Hecho opcional
  status?: string;

  @ApiProperty({ required: false })
  @IsDateString() // <-- CORREGIDO: De @IsDate a @IsDateString
  @IsOptional() // <-- CORREGIDO: Hecho opcional
  startDate?: string; // <-- CORREGIDO: Añadido '?'

  @ApiProperty({ required: false })
  @IsDateString() // <-- CORREGIDO: De @IsDate a @IsDateString
  @IsOptional() // <-- CORREGIDO: Hecho opcional
  endDate?: string; // <-- CORREGIDO: Añadido '?'

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty() // <-- Añadido para seguridad
  careerId: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional() // <-- CORREGIDO: Hecho opcional
  skillsId?: string; // <-- CORREGIDO: Añadido '?'
}