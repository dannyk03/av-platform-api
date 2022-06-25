import { ConnectionNames } from '@/database';
import { EnumStatusCodeError } from '@/utils/error/error.constant';
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
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Response } from '@/utils/response';

@Controller({
  version: VERSION_NEUTRAL,
  path: 'health',
})
export class HealthController {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    private readonly healthService: HealthCheckService,
    private readonly memoryHealthIndicator: MemoryHealthIndicator,
    private readonly diskHealthIndicator: DiskHealthIndicator,
    private readonly databaseIndicator: TypeOrmHealthIndicator,
  ) {}

  private checkDatabase = () =>
    this.databaseIndicator.pingCheck('database', {
      connection: this.defaultDataSource,
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

  @Response('health.check')
  @HealthCheck()
  @Get()
  checkAll() {
    return this.healthService.check([
      this.checkDatabase,
      this.checkMemoryHeap,
      this.checkMemoryRss,
      this.checkStorage,
    ]);
  }

  @Response('health.check')
  @HealthCheck()
  @Get('/database')
  async healthCheckDatabase(): Promise<IResponse> {
    try {
      return this.healthService.check([this.checkDatabase]);
    } catch (e) {
      throw new InternalServerErrorException({
        statusCode: EnumStatusCodeError.UnknownError,
        message: 'http.serverError.internalServerError',
      });
    }
  }

  @Response('health.check')
  @HealthCheck()
  @Get('/memory-heap')
  async healthCheckMemoryHeap(): Promise<IResponse> {
    try {
      return this.healthService.check([this.checkMemoryHeap]);
    } catch (e) {
      throw new InternalServerErrorException({
        statusCode: EnumStatusCodeError.UnknownError,
        message: 'http.serverError.internalServerError',
      });
    }
  }

  @Response('health.check')
  @HealthCheck()
  @Get('/memory-rss')
  async healthCheckMemoryRss(): Promise<IResponse> {
    try {
      return this.healthService.check([this.checkMemoryRss]);
    } catch (e) {
      throw new InternalServerErrorException({
        statusCode: EnumStatusCodeError.UnknownError,
        message: 'http.serverError.internalServerError',
      });
    }
  }

  @Response('health.check')
  @HealthCheck()
  @Get('/storage')
  async healthCheckStorage(): Promise<IResponse> {
    try {
      return this.healthService.check([this.checkStorage]);
    } catch (e) {
      throw new InternalServerErrorException({
        statusCode: EnumStatusCodeError.UnknownError,
        message: 'http.serverError.internalServerError',
      });
    }
  }
}
