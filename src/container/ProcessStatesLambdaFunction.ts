// import { Descriptor } from 'pip-services3-commons-node';
// import { CommandableLambdaFunction } from 'pip-services3-aws-node';
// import { ProcessStatesServiceFactory } from '../build/ProcessStatesServiceFactory';

// export class ProcessStatesLambdaFunction extends CommandableLambdaFunction {
//     public constructor() {
//         super("process_states", "Process states function");
//         this._dependencyResolver.put('controller', new Descriptor('pip-services-processstates', 'controller', 'default', '*', '*'));
//         this._factories.add(new ProcessStatesServiceFactory());
//     }
// }

// export const handler = new ProcessStatesLambdaFunction().getHandler();