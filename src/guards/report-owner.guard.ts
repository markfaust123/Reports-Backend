import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequestWithUser } from 'src/decorators/user-id.decorator';
import { ReportsService } from 'src/reports/reports.service';

@Injectable()
export class ReportOwnershipGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private reportService: ReportsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Get the user id from the request object
    const user = (request as RequestWithUser).user;
    const userId = user.userId;
    // The JWT strategy will throw an error if it fails to validate the token

    // Get the report id from the request params
    const reportId = request.params.id;

    // If reportId is not provided
    if (!reportId) {
      throw new BadRequestException('Invalid or missing report ID');
    }

    const report = await this.reportService.findOne(reportId);

    // If report does not exist
    if (!report) {
      throw new NotFoundException(`Report with ID ${reportId} not found`);
    }

    // Check if the report belongs to the user
    return report.userId == userId;
  }
}
