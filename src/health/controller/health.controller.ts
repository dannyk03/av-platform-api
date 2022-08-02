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

import { DataSource } from 'typeorm';

import { IResponse } from '@/utils/response/response.interface';

import { ConnectionNames } from '@/database';
import { RequestExcludeTimestamp } from '@/utils/request';
import { Response } from '@/utils/response';

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

  @Response('health.check')
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

  @Response('health.check')
  @HealthCheck()
  @Get('/database')
  async healthCheckDatabase(): Promise<IResponse> {
    return this.healthService.check([this.checkDatabase]);
  }

  @Response('health.check')
  @HealthCheck()
  @Get('/memory-heap')
  async healthCheckMemoryHeap(): Promise<IResponse> {
    return this.healthService.check([this.checkMemoryHeap]);
  }

  @Response('health.check')
  @HealthCheck()
  @Get('/memory-rss')
  async healthCheckMemoryRss(): Promise<IResponse> {
    return this.healthService.check([this.checkMemoryRss]);
  }

  @Response('health.check')
  @HealthCheck()
  @Get('/storage')
  async healthCheckStorage(): Promise<IResponse> {
    return this.healthService.check([this.checkStorage]);
  }

  @Response('health.check')
  @HealthCheck()
  @Get('/cloudinary')
  async healthCheckCloudinary(): Promise<IResponse> {
    return this.healthService.check([this.checkCloudinary]);
  }
}
