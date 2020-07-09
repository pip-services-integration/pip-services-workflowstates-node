// import { CommandSet } from 'pip-services3-commons-node';
// import { ICommand } from 'pip-services3-commons-node';
// import { Command } from 'pip-services3-commons-node';
// import { Schema } from 'pip-services3-commons-node';
// import { Parameters } from 'pip-services3-commons-node';
// import { FilterParams } from 'pip-services3-commons-node';
// import { PagingParams } from 'pip-services3-commons-node';
// import { ObjectSchema } from 'pip-services3-commons-node';
// import { TypeCode } from 'pip-services3-commons-node';
// import { FilterParamsSchema } from 'pip-services3-commons-node';
// import { PagingParamsSchema } from 'pip-services3-commons-node';
// import { WorkflowStateV1 } from '../data/version1/WorkflowStateV1';
// import { WorkflowStateV1Schema } from '../data/version1/WorkflowStateV1Schema';
// import { IWorkflowStatesController } from './IWorkflowStatesController';
// export class WorkflowStatesCommandSet extends CommandSet {
//     private _logic: IWorkflowStatesController;
//     constructor(logic: IWorkflowStatesController) {
//         super();
//         this._logic = logic;
//         // Register commands to the database
// 		this.addCommand(this.makeGetWorkflowStatesCommand());
// 		this.addCommand(this.makeGetWorkflowStateByIdCommand());
// 		this.addCommand(this.makeCreateWorkflowStateCommand());
// 		this.addCommand(this.makeUpdateWorkflowStateCommand());
// 		this.addCommand(this.makeDeleteWorkflowStateByIdCommand());
//     }
// 	private makeGetWorkflowStatesCommand(): ICommand {
// 		return new Command(
// 			"get_states",
// 			new ObjectSchema(true)
// 				.withOptionalProperty('filter', new FilterParamsSchema())
// 				.withOptionalProperty('paging', new PagingParamsSchema()),
//             (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
//                 let filter = FilterParams.fromValue(args.get("filter"));
//                 let paging = PagingParams.fromValue(args.get("paging"));
//                 this._logic.getStates(correlationId, filter, paging, callback);
//             }
// 		);
// 	}
// 	private makeGetWorkflowStateByIdCommand(): ICommand {
// 		return new Command(
// 			"get_state_by_id",
// 			new ObjectSchema(true)
// 				.withRequiredProperty('state_id', TypeCode.String)
// 				.withRequiredProperty('customer_id', TypeCode.String),
//             (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
//                 let stateId = args.getAsString("state_id");
//                 let customerId = args.getAsString("customer_id");
//                 this._logic.getStateById(correlationId, stateId, customerId, callback);
//             }
// 		);
// 	}
// 	private makeCreateWorkflowStateCommand(): ICommand {
// 		return new Command(
// 			"create_state",
// 			new ObjectSchema(true)
// 				.withRequiredProperty('state', new WorkflowStateV1Schema()),
//             (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
//                 let state = args.get("state");
//                 this._logic.createState(correlationId, state, callback);
//             }
// 		);
// 	}
// 	private makeUpdateWorkflowStateCommand(): ICommand {
// 		return new Command(
// 			"update_state",
// 			new ObjectSchema(true)
// 				.withRequiredProperty('state', new WorkflowStateV1Schema()),
//             (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
//                 let state = args.get("state");
//                 this._logic.updateState(correlationId, state, callback);
//             }
// 		);
// 	}
// 	private makeDeleteWorkflowStateByIdCommand(): ICommand {
// 		return new Command(
// 			"delete_state_by_id",
// 			new ObjectSchema(true)
// 				.withRequiredProperty('state_id', TypeCode.String)
// 				.withRequiredProperty('customer_id', TypeCode.String),
//             (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
//                 let stateId = args.getAsNullableString("state_id");
//                 let customerId = args.getAsString("customer_id");
//                 this._logic.deleteStateById(correlationId, stateId, customerId, callback);
// 			}
// 		);
// 	}
// }
//# sourceMappingURL=WorkflowStatesCommandSet.js.map