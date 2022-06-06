import { ConnectionNames } from '@/database';
import { ENUM_STATUS_CODE_ERROR } from '@/utils/error/error.constant';
import { IResponse } from '@/utils/response/response.interface';
import {
  Controller,
  Get,
  InternalServerErrorException,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller({
  version: VERSION_NEUTRAL,
  path: 'health',
})
export class HealthController {
  constructor(
    private readonly healthService: HealthCheckService,
    private readonly memoryHealthIndicator: MemoryHealthIndicator,
    private readonly diskHealthIndicator: DiskHealthIndicator,
    private readonly databaseIndicator: TypeOrmHealthIndicator,
  ) {}

  private checkDatabase = () =>
    this.databaseIndicator.pingCheck('database', {
      connection: ConnectionNames.Master,
      timeout: 1500,
    });

  private checkMemoryHeap = () =>
    this.memoryHealthIndicator.checkHeap('memory heap', 300 * 1024 * 1024);

  private checkMemoryRss = () =>
    this.memoryHealthIndicator.checkRSS('memory RSS', 300 * 1024 * 1024);

  private checkStorage = () =>
    this.diskHealthIndicator.checkStorage('disk health', {
      thresholdPercent: 0.75,
      path: '/',
    });

  @Get()
  @HealthCheck()
  checkAll() {
    return this.healthService.check([
      this.checkDatabase,
      this.checkMemoryHeap,
      this.checkMemoryRss,
      this.checkStorage,
    ]);
  }

  @HealthCheck()
  @Get('/database')
  async healthCheckDatabase(): Promise<IResponse> {
    try {
      return this.healthService.check([this.checkDatabase]);
    } catch (e) {
      throw new InternalServerErrorException({
        statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
        message: 'http.serverError.internalServerError',
      });
    }
  }

  @HealthCheck()
  @Get('/memory-heap')
  async healthCheckMemoryHeap(): Promise<IResponse> {
    try {
      return this.healthService.check([this.checkMemoryHeap]);
    } catch (e) {
      throw new InternalServerErrorException({
        statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
        message: 'http.serverError.internalServerError',
      });
    }
  }

  @HealthCheck()
  @Get('/memory-rss')
  async healthCheckMemoryRss(): Promise<IResponse> {
    try {
      return this.healthService.check([this.checkMemoryRss]);
    } catch (e) {
      throw new InternalServerErrorException({
        statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
        message: 'http.serverError.internalServerError',
      });
    }
  }

  @HealthCheck()
  @Get('/storage')
  async healthCheckStorage(): Promise<IResponse> {
    try {
      return this.healthService.check([this.checkStorage]);
    } catch (e) {
      throw new InternalServerErrorException({
        statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
        message: 'http.serverError.internalServerError',
      });
    }
  }
}
