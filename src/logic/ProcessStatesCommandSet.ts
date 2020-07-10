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

// import { ProcessStateV1 } from '../data/version1/ProcessStateV1';
// import { ProcessStateV1Schema } from '../data/version1/ProcessStateV1Schema';
// import { IProcessStatesController } from './IProcessStatesController';

// export class ProcessStatesCommandSet extends CommandSet {
//     private _logic: IProcessStatesController;

//     constructor(logic: IProcessStatesController) {
//         super();

//         this._logic = logic;

//         // Register commands to the database
// 		this.addCommand(this.makeGetProcessStatesCommand());
// 		this.addCommand(this.makeGetProcessStateByIdCommand());
// 		this.addCommand(this.makeCreateProcessStateCommand());
// 		this.addCommand(this.makeUpdateProcessStateCommand());
// 		this.addCommand(this.makeDeleteProcessStateByIdCommand());
//     }

// 	private makeGetProcessStatesCommand(): ICommand {
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

// 	private makeGetProcessStateByIdCommand(): ICommand {
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

// 	private makeCreateProcessStateCommand(): ICommand {
// 		return new Command(
// 			"create_state",
// 			new ObjectSchema(true)
// 				.withRequiredProperty('state', new ProcessStateV1Schema()),
//             (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
//                 let state = args.get("state");
//                 this._logic.createState(correlationId, state, callback);
//             }
// 		);
// 	}

// 	private makeUpdateProcessStateCommand(): ICommand {
// 		return new Command(
// 			"update_state",
// 			new ObjectSchema(true)
// 				.withRequiredProperty('state', new ProcessStateV1Schema()),
//             (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
//                 let state = args.get("state");
//                 this._logic.updateState(correlationId, state, callback);
//             }
// 		);
// 	}
	
// 	private makeDeleteProcessStateByIdCommand(): ICommand {
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