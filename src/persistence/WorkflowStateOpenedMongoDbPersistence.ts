// {
//     public class WorkflowStatusOpenedMongoDbPersistence : IdentifiableMongoDbPersistence<WorkflowStatusMongoDbSchema, string>, IWorkflowStatusPersistence
//     {
//         public WorkflowStatusOpenedMongoDbPersistence()
//             : this("workflows")
//         {
//         }

//         public WorkflowStatusOpenedMongoDbPersistence(string collectionName)
//             : base(collectionName)
//         {
//         }

//         protected override FilterDefinition<WorkflowStatusMongoDbSchema> ComposeFilter(FilterParams filterParams)
//         {
//             filterParams = filterParams ?? new FilterParams();

//             var builder = Builders<WorkflowStatusMongoDbSchema>.Filter;
//             var filter = builder.Empty;

//             foreach (var filterKey in filterParams.Keys)
//             {
//                 if (filterKey.Equals("state"))
//                 {
//                     filter &= builder.Eq(s => s.State, filterParams.GetAsNullableString(filterKey));
//                     continue;
//                 }

//                 if (filterKey.Equals("states"))
//                 {
//                     filter &= builder.In(s => s.State, ToArray(filterParams.GetAsNullableString(filterKey)));
//                     continue;
//                 }
                
//                 if (filterKey.Equals("type"))
//                 {
//                     filter &= builder.Eq(s => s.Type, filterParams.GetAsNullableString(filterKey));
//                     continue;
//                 }

//                 if (filterKey.Equals("expired") && filterParams.GetAsBoolean("expired"))
//                 {
//                     filter &= builder.Lte(s => s.ExpirationTimeUtc, DateTime.UtcNow);
//                     continue;
//                 }

//                 if (filterKey.Equals("compensated") && filterParams.GetAsBoolean("compensated"))
//                 {
//                     filter &= builder.Lte(s => s.CompensationTimeUtc, DateTime.UtcNow);
//                     continue;
//                 }

//                 if (filterKey.Equals("truncate_time"))
//                 {
//                     filter &= builder.Lte(s => s.StartTimeUtc, filterParams.GetAsDateTime("truncate_time"));
//                     continue;
//                 }
                
//                 if (filterKey.Equals("from_time"))
//                 {
//                     filter &= builder.Gte(s => s.StartTimeUtc, filterParams.GetAsDateTime("from_time"));
//                     continue;
//                 }
                
//                 if (filterKey.Equals("to_time"))
//                 {
//                     filter &= builder.Lte(s => s.StartTimeUtc, filterParams.GetAsDateTime("to_time"));
//                     continue;
//                 }

//                 if (filterKey.Equals("search"))
//                 {
//                     var searchFilter = builder.Eq(s => s.Type, filterParams.GetAsNullableString(filterKey));
//                     searchFilter |= builder.Eq(s => s.Id, filterParams.GetAsNullableString(filterKey));
//                     searchFilter |= builder.Eq(s => s.InitiatorId, filterParams.GetAsNullableString(filterKey));
//                     searchFilter |= builder.Eq(s => s.Request, filterParams.GetAsNullableString(filterKey));
//                     searchFilter |= builder.Eq(s => s.Key, filterParams.GetAsNullableString(filterKey));

//                     searchFilter |= builder.Regex(s => s.Key, new BsonRegularExpression(WildcardToRegex(filterParams[filterKey]), "i"));
//                     searchFilter |= builder.Regex(s => s.Request, new BsonRegularExpression(WildcardToRegex(filterParams[filterKey]), "i"));

//                     filter &= searchFilter;
//                     continue;
//                 }

//                 if (filterKey.Equals("activities.message.message"))
//                 {
//                     filter &= builder.ElemMatch(s => s.Activities, a => a.Message != null && Regex.IsMatch(a.Message.Message, WildcardToRegex(filterParams[filterKey])));
//                     continue;
//                 }

//                 if (filterKey.Equals("activities.error_message"))
//                 {
//                     filter &= builder.ElemMatch(s => s.Activities, a => Regex.IsMatch(a.ErrorMessage, WildcardToRegex(filterParams[filterKey])));
//                     continue;
//                 }

//                 filter &= builder.Eq(filterKey, filterParams[filterKey]);
//             }

//             return filter;
//         }

//         public async Task ClearAsync()
//         {
//             await ClearAsync(null);
//         }

//         public async Task<DataPage<object>> GetAsync(string correlationId, FilterParams filter, PagingParams paging, SortParams sort, ProjectionParams projection)
//         {
//             return await GetPageByFilterAndProjectionAsync(correlationId, ComposeFilter(filter), paging, ComposeSort(sort), projection);
//         }

//         public async Task<object> GetByIdAsync(string correlationId, string id, ProjectionParams projection)
//         {
//             return await GetOneByIdAsync(correlationId, id, projection);
//         }

//         public async Task<WorkflowStatusV1> CreateAsync(string correlationId, WorkflowStatusV1 workflowStatus)
//         {
//             var result = await CreateAsync(correlationId, FromPublic(workflowStatus));

//             return ToPublic(result);
//         }

//         public async Task<WorkflowStatusV1> DeleteAsync(string correlationId, string id)
//         {
//             var result = await DeleteByIdAsync(correlationId, id);

//             return ToPublic(result);
//         }

//         public async Task DeleteAsync(string correlationId, FilterParams filter)
//         {
//             await DeleteByFilterAsync(correlationId, ComposeFilter(filter));
//         }

//         public async Task<DataPage<WorkflowStatusV1>> GetAsync(string correlationId, FilterParams filter, PagingParams paging, SortParams sort)
//         {
//             var result = await GetPageByFilterAsync(correlationId, ComposeFilter(filter), paging, ComposeSort(sort));
//             var data = result.Data.ConvertAll(ToPublic);

//             return new DataPage<WorkflowStatusV1>
//             {
//                 Data = data,
//                 Total = result.Total
//             };
//         }

//         public async Task<WorkflowStatusV1> GetByIdAsync(string correlationId, string id)
//         {
//             var result = await GetOneByIdAsync(correlationId, id);

//             return ToPublic(result);
//         }

//         public async Task<WorkflowStatusV1> GetOneByFilterAsync(string correlationId, FilterParams filter)
//         {
//             var result = await _collection.Find(ComposeFilter(filter)).FirstOrDefaultAsync();

//             if (result == null)
//             {
//                 _logger.Trace(correlationId, $"Nothing found from {_collectionName} with filter = '{filter.ToString()}'.");
//                 return await Task.FromResult(default(WorkflowStatusV1));
//             }

//             _logger.Trace(correlationId, $"Retrieved from {_collectionName} with filter = '{filter.ToString()}'.");

//             return ToPublic(result);
//         }

//         public async Task<WorkflowStatusV1> UpdateAsync(string correlationId, WorkflowStatusV1 workflowStatus)
//         {
//             var result = await UpdateAsync(correlationId, FromPublic(workflowStatus));

//             return ToPublic(result);
//         }
        
//         private static WorkflowStatusV1 ToPublic(WorkflowStatusMongoDbSchema value)
//         {
//             if (value == null)
//             {
//                 return null;
//             }

//             var result = new WorkflowStatusV1
//             {
//                 Activities = ToPublic(value.Activities),
//                 AttemptCount = value.AttemptCount,
//                 Comment = value.Comment,
//                 CompensationMessage = ToPublic(value.CompensationMessage),
//                 CompensationQueueName = value.CompensationQueueName,
//                 CompensationTimeUtc = value.CompensationTimeUtc,
//                 CompensationTimeout = value.CompensationTimeout,
//                 Data = new Dictionary<string, string>(value.Data),
//                 EndTimeUtc = value.EndTimeUtc,
//                 ExpirationTimeUtc = value.ExpirationTimeUtc,
//                 Id = value.Id,
//                 InitiatorId = value.InitiatorId,
//                 Key = value.Key,
//                 LastActionTimeUtc = value.LastActionTimeUtc,
//                 LockedUntilTimeUtc = value.LockedUntilTimeUtc,
//                 LockToken = value.LockToken,
//                 Request = value.Request,
//                 StartTimeUtc = value.StartTimeUtc,
//                 State = value.State,
//                 Type = value.Type
//             };

//             return result;
//         }

//         private static List<ActivityStatusV1> ToPublic(List<ActivityStatusMongoDbSchema> activities)
//         {
//             var result = new List<ActivityStatusV1>();

//             if (activities == null)
//             {
//                 return result;
//             }

//             foreach (var activity in activities)
//             {
//                 result.Add(new ActivityStatusV1
//                 {
//                     EndTimeUtc = activity.EndTimeUtc,
//                     ErrorMessage = activity.ErrorMessage,
//                     Message = ToPublic(activity.Message),
//                     QueueName = activity.QueueName,
//                     StartTimeUtc = activity.StartTimeUtc,
//                     State = activity.State,
//                     Type = activity.Type
//                 });
//             }

//             return result;
//         }

//         private static MessageEnvelope ToPublic(MessageEnvelopeMongoDbSchema message)
//         {
//             if (message == null)
//             {
//                 return null;
//             }

//             return new MessageEnvelope
//             {
//                 CorrelationId = message.CorrelationId,
//                 Message = message.Message,
//                 MessageId = message.MessageId,
//                 MessageType = message.MessageType,
//                 SentTime = message.SentTime
//             };
//         }

//         private static WorkflowStatusMongoDbSchema FromPublic(WorkflowStatusV1 value)
//         {
//             if (value == null)
//             {
//                 return null;
//             }

//             var result = new WorkflowStatusMongoDbSchema
//             {
//                 Activities = FromPublic(value.Activities),
//                 AttemptCount = value.AttemptCount,
//                 Comment = value.Comment,
//                 CompensationMessage = FromPublic(value.CompensationMessage),
//                 CompensationQueueName = value.CompensationQueueName,
//                 CompensationTimeUtc = value.CompensationTimeUtc,
//                 CompensationTimeout = value.CompensationTimeout,
//                 Data = new Dictionary<string, string>(value.Data),
//                 EndTimeUtc = value.EndTimeUtc,
//                 ExpirationTimeUtc = value.ExpirationTimeUtc,
//                 Id = value.Id,
//                 InitiatorId = value.InitiatorId,
//                 Key = value.Key,
//                 LastActionTimeUtc = value.LastActionTimeUtc,
//                 LockedUntilTimeUtc = value.LockedUntilTimeUtc,
//                 LockToken = value.LockToken,
//                 Request = value.Request,
//                 StartTimeUtc = value.StartTimeUtc,
//                 State = value.State,
//                 Type = value.Type
//             };

//             return result;
//         }

//         private static List<ActivityStatusMongoDbSchema> FromPublic(List<ActivityStatusV1> activities)
//         {
//             var result = new List<ActivityStatusMongoDbSchema>();

//             if (activities == null)
//             {
//                 return result;
//             }

//             foreach (var activity in activities)
//             {
//                 result.Add(new ActivityStatusMongoDbSchema
//                 {
//                     EndTimeUtc = activity.EndTimeUtc,
//                     ErrorMessage = activity.ErrorMessage,
//                     Message = FromPublic(activity.Message),
//                     QueueName = activity.QueueName,
//                     StartTimeUtc = activity.StartTimeUtc,
//                     State = activity.State,
//                     Type = activity.Type
//                 });
//             }

//             return result;
//         }

//         private static MessageEnvelopeMongoDbSchema FromPublic(MessageEnvelope message)
//         {
//             if (message == null)
//             {
//                 return null;
//             }

//             return new MessageEnvelopeMongoDbSchema
//             {
//                 CorrelationId = message.CorrelationId,
//                 Message = message.Message,
//                 MessageId = message.MessageId,
//                 MessageType = message.MessageType,
//                 SentTime = message.SentTime
//             };
//         }

//         private static string[] ToArray(string value)
//         {
//             var items = value?.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries) as string[];
//             return items?.Length > 0 ? items : null;
//         }

//         public async Task<bool> UpdateThroughputAsync(string correlationId, int throughput)
//         {
//             return await Task.FromResult(false);
//         }

//         private static string WildcardToRegex(string wildcard)
//         {
//             return "^" + wildcard.Replace(".", "\\.").Replace(")", "\\)").Replace("(", "\\(").Replace("?", ".?").Replace("*", ".*") + "$";
//         }
//     }
// }
