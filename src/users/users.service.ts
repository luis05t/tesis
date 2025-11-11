import * as bcrypt from 'bcryptjs'; // <-- 1. La importación que faltaba

import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseService } from 'src/prisma/base.service';
import { UserModel } from 'src/prisma/generated/models';

@Injectable()
export class UsersService extends BaseService<
  UserModel,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(
    private readonly prismaService: PrismaService, // <-- Tu constructor original
  ) {
    // --- 2. LA CORRECCIÓN AL ERROR ---
    // El segundo argumento debe ser un objeto, no un string
    super(prismaService, { name: 'user' });
  }

  // --- 3. EL MÉTODO QUE ENCRIPTA ---
  async create(data: CreateUserDto): Promise<UserModel> {
    // Encripta la contraseña
    data.password = bcrypt.hashSync(data.password, 10);

    // Llama al método 'create' original (del BaseService)
    return super.create(data);
  }
}