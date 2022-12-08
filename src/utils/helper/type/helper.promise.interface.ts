export interface IHelperPromiseService {
  mapPromiseBasedResultToResponseReport(result: PromiseSettledResult<string>[]);
  mapSettledPromiseData(arr: PromiseSettledResult<any>[]): Promise<any[]>;
}
