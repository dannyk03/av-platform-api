import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Throttle } from '@nestjs/throttler';
import { InjectDataSource } from '@nestjs/typeorm';

import { IResponseData } from '@avo/type';

import { DataSource } from 'typeorm';

import { RequestExcludeTimestamp } from '@/utils/request/decorator';
import { ClientResponse } from '@/utils/response/decorator';

import { ConnectionNames } from '@/database/constant';

import { CloudinaryHealthIndicator } from '../indicator/health.cloudinary.indicator';

@Throttle(1, 5)
@RequestExcludeTimestamp()
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
    private readonly cloudinaryIndicator: CloudinaryHealthIndicator,
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

  private checkCloudinary = async () => this.cloudinaryIndicator.isHealthy();

  @ClientResponse('health.check')
  @HealthCheck()
  @Get()
  checkAll() {
    return this.healthService.check([
      this.checkDatabase,
      this.checkMemoryHeap,
      this.checkMemoryRss,
      this.checkStorage,
      this.checkCloudinary,
    ]);
  }

  @ClientResponse('health.check')
  @HealthCheck()
  @Get('/database')
  async healthCheckDatabase(): Promise<IResponseData> {
    return this.healthService.check([this.checkDatabase]);
  }

  @ClientResponse('health.check')
  @HealthCheck()
  @Get('/memory-heap')
  async healthCheckMemoryHeap(): Promise<IResponseData> {
    return this.healthService.check([this.checkMemoryHeap]);
  }

  @ClientResponse('health.check')
  @HealthCheck()
  @Get('/memory-rss')
  async healthCheckMemoryRss(): Promise<IResponseData> {
    return this.healthService.check([this.checkMemoryRss]);
  }

  @ClientResponse('health.check')
  @HealthCheck()
  @Get('/storage')
  async healthCheckStorage(): Promise<IResponseData> {
    return this.healthService.check([this.checkStorage]);
  }

  @ClientResponse('health.check')
  @HealthCheck()
  @Get('/cloudinary')
  async healthCheckCloudinary(): Promise<IResponseData> {
    return this.healthService.check([this.checkCloudinary]);
  }
}
