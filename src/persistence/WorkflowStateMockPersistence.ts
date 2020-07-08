
// 
// {
//     [ExcludeFromCodeCoverage]
//     public class WorkflowStatusMockPersistence : AbstractMockDbPersistence<WorkflowStatusV1>, IWorkflowStatusCompositePersistence
//     {
//         public async Task<DataPage<object>> GetAsync(string correlationId, FilterParams filter, PagingParams paging, SortParams sort, ProjectionParams projection)
//         {
//             return await base.GetAsync(correlationId, filter, paging, projection);
//         }

//         public async Task DeleteAsync(string correlationId, FilterParams filter)
//         {
//             await Task.Delay(100);
//         }

//         public async Task<DataPage<WorkflowStatusV1>> GetAsync(string correlationId, FilterParams filter, PagingParams paging, SortParams sort)
//         {
//             return await base.GetAsync(correlationId, filter, paging);
//         }

//         public async Task<WorkflowStatusV1> GetOneByFilterAsync(string correlationId, FilterParams filter)
//         {
//             var result = await base.GetAsync(correlationId, filter, null);
//             return result.Data?.FirstOrDefault();
//         }

//         public async Task<bool> UpdateThroughputAsync(string correlationId, int throughput)
//         {
//             return await Task.FromResult(false);
//         }

//         public IWorkflowStatusPersistence WorkflowsOpenedPersistence { get; set; }
//         public IWorkflowStatusPersistence WorkflowsClosedPersistence { get; set; }
        
//         public async Task<WorkflowStatusV1> CreateInClosedPersistenceAsync(string correlationId, WorkflowStatusV1 workflowStatus)
//         {
//             return await Task.FromResult(default(WorkflowStatusV1));
//         }

//         public async Task DeleteInClosedPersistenceAsync(string correlationId, FilterParams filter)
//         {
//             await Task.Delay(100);
//         }

//         public async Task<WorkflowStatusV1> UpdateInOpenedPersistenceAsync(string correlationId, WorkflowStatusV1 workflowStatus)
//         {
//             return await Task.FromResult(default(WorkflowStatusV1));
//         }

//         public async Task<WorkflowStatusV1> DeleteAsync(string correlationId, string id, PersistenceStorage persistenceStorage)
//         {
//             return await Task.FromResult(default(WorkflowStatusV1));
//         }

//         public async Task DeleteAsync(string correlationId, FilterParams filter, PersistenceStorage persistenceStorage)
//         {
//             await Task.Delay(100);
//         }

//         public async Task<DataPage<object>> GetAsync(string correlationId, FilterParams filter, PagingParams paging, SortParams sort, ProjectionParams projection, PersistenceStorage persistenceStorage)
//         {
//             return await base.GetAsync(correlationId, filter, paging, projection);
//         }
//     }
// }
