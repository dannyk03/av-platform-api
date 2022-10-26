export interface IHelperPromiseService {
  mapPromiseBasedResultToResponseReport(result: PromiseSettledResult<string>[]);
}
