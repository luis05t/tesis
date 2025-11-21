import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { BaseService } from 'src/prisma/base.service';
import { ProjectModel } from 'src/prisma/generated/models';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectsService extends BaseService<ProjectModel, CreateProjectDto, UpdateProjectDto> {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService, { name: 'project' });
  }

  async findProjectsBySkillId(skillId: string) {
    try{
      const projects = await this.prismaService.project.findMany({
      where: {
        projectSkills: {
          some: {
            skillId: skillId,
          },
        },
      },
    });
    return projects;
    }catch(error){
      throw error;
    }
  }
}