
// 
// {
//     public class WorkflowStatusMongoDbCompositePersistence : IReferenceable, IConfigurable, IOpenable, IWorkflowStatusCompositePersistence
//     {
//         public IWorkflowStatusPersistence WorkflowsOpenedPersistence { get; set; }
//         public IWorkflowStatusPersistence WorkflowsClosedPersistence { get; set; }
        
//         private WorkflowStatusOpenedMongoDbPersistence _workflowsOpenedPersistence = new WorkflowStatusOpenedMongoDbPersistence(WorkflowStatusConstants.CollectionNames.WorkflowsOpen);
//         private WorkflowStatusClosedMongoDbPersistence _workflowsClosedPersistence = new WorkflowStatusClosedMongoDbPersistence(WorkflowStatusConstants.CollectionNames.WorkflowsClosed);

//         public void Configure(ConfigParams config)
//         {
//             _workflowsOpenedPersistence = new WorkflowStatusOpenedMongoDbPersistence(config.GetAsStringWithDefault("collections.open", WorkflowStatusConstants.CollectionNames.WorkflowsOpen));
//             _workflowsClosedPersistence = new WorkflowStatusClosedMongoDbPersistence(config.GetAsStringWithDefault("collections.closed", WorkflowStatusConstants.CollectionNames.WorkflowsClosed));

//             _workflowsOpenedPersistence.Configure(config);
//             _workflowsClosedPersistence.Configure(config);

//             WorkflowsOpenedPersistence = _workflowsOpenedPersistence;
//             WorkflowsClosedPersistence = _workflowsClosedPersistence;
//         }

//         public void SetReferences(IReferences references)
//         {
//             _workflowsOpenedPersistence.SetReferences(references);
//             _workflowsClosedPersistence.SetReferences(references);
//         }

//         public bool IsOpen()
//         {
//             return _workflowsOpenedPersistence != null && _workflowsOpenedPersistence.IsOpen() &&
//                 _workflowsClosedPersistence != null && _workflowsClosedPersistence.IsOpen();
//         }

//         public async Task OpenAsync(string correlationId)
//         {
//             await _workflowsOpenedPersistence.OpenAsync(correlationId);
//             await _workflowsClosedPersistence.OpenAsync(correlationId);
//         }

//         public async Task CloseAsync(string correlationId)
//         {
//             await _workflowsOpenedPersistence.CloseAsync(correlationId);
//             await _workflowsClosedPersistence.CloseAsync(correlationId);
//         }

//         public async Task<WorkflowStatusV1> CreateAsync(string correlationId, WorkflowStatusV1 workflowStatus)
//         {
//             if (workflowStatus.State == WorkflowStateV1.Starting
//                 || workflowStatus.State == WorkflowStateV1.Active
//                 || workflowStatus.State == WorkflowStateV1.WaitingForResponse
//                 || workflowStatus.State == WorkflowStateV1.Failed)
//             {
//                 await _workflowsOpenedPersistence.CreateAsync(correlationId, workflowStatus);
//             }

//             return await _workflowsClosedPersistence.CreateAsync(correlationId, workflowStatus);
//         }

//         public async Task<WorkflowStatusV1> UpdateAsync(string correlationId, WorkflowStatusV1 workflowStatus)
//         {
//             // For open workflows access only opened
//             if (workflowStatus.State == WorkflowStateV1.Starting
//                 || workflowStatus.State == WorkflowStateV1.Active
//                 || workflowStatus.State == WorkflowStateV1.WaitingForResponse
//                 || workflowStatus.State == WorkflowStateV1.Failed)
//             {
//                 await _workflowsOpenedPersistence.UpdateAsync(correlationId, workflowStatus);
//             }
//             else
//             {
//                 await _workflowsOpenedPersistence.DeleteAsync(correlationId, workflowStatus.Id);
//             }

//             return await _workflowsClosedPersistence.UpdateAsync(correlationId, workflowStatus);
//         }

//         public async Task<WorkflowStatusV1> DeleteAsync(string correlationId, string id)
//         {
//             return await DeleteAsync(correlationId, id, PersistenceStorage.Composite);
//         }

//         public async Task DeleteAsync(string correlationId, FilterParams filter)
//         {
//             await DeleteAsync(correlationId, filter, PersistenceStorage.Composite);
//         }

//         public async Task<WorkflowStatusV1> GetByIdAsync(string correlationId, string id)
//         {
//             return await _workflowsClosedPersistence.GetByIdAsync(correlationId, id);
//         }

//         public async Task<object> GetByIdAsync(string correlationId, string id, ProjectionParams projection)
//         {
//             return await _workflowsClosedPersistence.GetByIdAsync(correlationId, id, projection);
//         }

//         public async Task<DataPage<WorkflowStatusV1>> GetAsync(string correlationId, FilterParams filter, PagingParams paging, SortParams sort)
//         {
//             if (QueryAnalyzer.IsOpenQuery(filter))
//             {
//                 return await _workflowsOpenedPersistence.GetAsync(correlationId, filter, paging, sort);
//             }
//             else
//             {
//                 return await _workflowsClosedPersistence.GetAsync(correlationId, filter, paging, sort);
//             }
//         }

//         public async Task<DataPage<object>> GetAsync(string correlationId, FilterParams filter, PagingParams paging, SortParams sort, ProjectionParams projection)
//         {
//             return await GetAsync(correlationId, filter, paging, sort, projection, PersistenceStorage.Composite);
//         }

//         public async Task<WorkflowStatusV1> GetOneByFilterAsync(string correlationId, FilterParams filter)
//         {
//             return await _workflowsOpenedPersistence.GetOneByFilterAsync(correlationId, filter);
//         }

//         public async Task ClearAsync()
//         {
//             await _workflowsOpenedPersistence.ClearAsync();
//             await _workflowsClosedPersistence.ClearAsync();
//         }

//         public async Task<bool> UpdateThroughputAsync(string correlationId, int throughput)
//         {
//             return await _workflowsClosedPersistence.UpdateThroughputAsync(correlationId, throughput);
//         }
        
//         public async Task<WorkflowStatusV1> CreateInClosedPersistenceAsync(string correlationId, WorkflowStatusV1 workflowStatus)
//         {
//             return await _workflowsClosedPersistence.CreateAsync(correlationId, workflowStatus);
//         }
        
//         public async Task<WorkflowStatusV1> UpdateInOpenedPersistenceAsync(string correlationId, WorkflowStatusV1 workflowStatus)
//         {
//             return await _workflowsOpenedPersistence.UpdateAsync(correlationId, workflowStatus);
//         }
        
//         public async Task<WorkflowStatusV1> DeleteAsync(string correlationId, string id, PersistenceStorage persistenceStorage)
//         {
//             if (persistenceStorage == PersistenceStorage.Composite)
//             {
//                 await _workflowsOpenedPersistence.DeleteAsync(correlationId, id);
//                 return await _workflowsClosedPersistence.DeleteAsync(correlationId, id);
//             }
//             else if (persistenceStorage == PersistenceStorage.Opened)
//             {
//                 return await _workflowsOpenedPersistence.DeleteAsync(correlationId, id);
//             }

//             return await _workflowsClosedPersistence.DeleteAsync(correlationId, id);
//         }


//         public async Task DeleteAsync(string correlationId, FilterParams filter, PersistenceStorage persistenceStorage)
//         {
//             if (persistenceStorage == PersistenceStorage.Composite)
//             {
//                 await _workflowsOpenedPersistence.DeleteAsync(correlationId, filter);
//                 await _workflowsClosedPersistence.DeleteAsync(correlationId, filter);
//             }
//             else if (persistenceStorage == PersistenceStorage.Opened)
//             {
//                 await _workflowsOpenedPersistence.DeleteAsync(correlationId, filter);
//             }
//             else if (persistenceStorage == PersistenceStorage.Closed)
//             {
//                 await _workflowsClosedPersistence.DeleteAsync(correlationId, filter);
//             }
//         }

//         public async Task<DataPage<object>> GetAsync(string correlationId, FilterParams filter, PagingParams paging, SortParams sort, ProjectionParams projection, PersistenceStorage persistenceStorage)
//         {
//             if (persistenceStorage == PersistenceStorage.Composite)
//             {
//                 if (QueryAnalyzer.IsOpenQuery(filter))
//                 {
//                     return await _workflowsOpenedPersistence.GetAsync(correlationId, filter, paging, sort, projection);
//                 }
//                 else
//                 {
//                     return await _workflowsClosedPersistence.GetAsync(correlationId, filter, paging, sort, projection);
//                 }
//             }
//             else if (persistenceStorage == PersistenceStorage.Opened)
//             {
//                 return await _workflowsOpenedPersistence.GetAsync(correlationId, filter, paging, sort, projection);
//             }

//             return await _workflowsClosedPersistence.GetAsync(correlationId, filter, paging, sort, projection);
//         }

//     }
// }

