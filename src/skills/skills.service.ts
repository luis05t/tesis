import { Injectable } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { BaseService } from 'src/prisma/base.service';
import { SkillsModel } from 'src/prisma/generated/models';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SkillsService extends BaseService<SkillsModel, CreateSkillDto, UpdateSkillDto> {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService, { name: 'skill' });
  }
}
