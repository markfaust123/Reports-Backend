import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './create-report.dto';
import { UpdateReportDto } from './update-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
  ) {}

  // Find a single report by its id
  async findOne(id: string): Promise<Report | null> {
    return this.reportRepository.findOneBy({ id });
  }

  // Find all reports
  async findAll(
    limit: number,
    offset: number,
    search?: string,
    userId?: number,
  ): Promise<Report[]> {
    // Custom query to handle more-advanced, custom SQL queries not handled by TypeORM
    const queryBuilder = this.reportRepository.createQueryBuilder('reports');
    let hasWhereCondition = false;

    // Search for Report title
    if (search !== undefined) {
      queryBuilder.where('reports.title ILIKE :search', {
        search: `%${search}%`,
      });
      // Somehow allow for search in description for word, too
      // queryBuilder.andWhere('reports.description ILIKE :search', {
      //   search: `%${search}%`,
      // });
      hasWhereCondition = true;
    }

    // Search via username
    if (userId !== undefined) {
      if (hasWhereCondition) {
        queryBuilder.andWhere('reports.userId = :userId', { userId });
      } else {
        queryBuilder.where('reports.userId = :userId', { userId });
        hasWhereCondition = true;
      }
    }

    // Pagination
    queryBuilder.limit(limit);
    queryBuilder.offset(offset);

    // Sort in reverse-chronological
    queryBuilder.orderBy('reports.timestamp', 'DESC');

    return await queryBuilder.getMany();
  }

  // Create a new report
  async create(
    createReportDto: CreateReportDto,
    userId: number,
  ): Promise<Report> {
    const report = await this.reportRepository.create({
      ...createReportDto,
      userId,
    });
    return this.reportRepository.save(report);
  }

  // Update an existing report
  async update(
    id: string,
    updateReportDto: UpdateReportDto,
  ): Promise<Report | null> {
    const report = await this.reportRepository.preload({
      id,
      ...updateReportDto,
    });
    if (!report) {
      return null;
    }
    return this.reportRepository.save(report);
  }

  // Delete an existing report
  async remove(id: string): Promise<Report | null> {
    const report = await this.findOne(id);
    if (!report) {
      return null;
    }
    return this.reportRepository.remove(report);
  }
}
