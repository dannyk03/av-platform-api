import { ILogMask } from '@/log/type';

export interface IHelperMaskService {
  maskBody({
    body,
    options,
  }: {
    body: Record<string, any>;
    options: ILogMask;
  }): Promise<Record<string, any>>;
}
