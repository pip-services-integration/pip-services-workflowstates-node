import { IStringIdentifiable } from 'pip-services3-commons-node';
import { IncomeItemV1 } from './IncomeItemV1';
import { DeductionItemV1 } from './DeductionItemV1';

export class WorkflowStateV1 implements IStringIdentifiable {
    public id: string;
    public number?: string;
    public party_id: string;
    public state?: string;
    public state_details?: string;

    public period_from?: Date;
    public period_to?: Date;

    public create_time?: Date;
    public update_time?: Date;
    public paid_time?: Date;
    
    public payment_method_id?: string;
    public payment_id?: string;
    public state_number?: string;
    
    public income?: IncomeItemV1[];
    public income_total: number;
    public ytd_income_total?: number;

    public deductions?: DeductionItemV1[];
    public deductions_total?: number;
    public ytd_deductions_total?: number;

    public net_total: number;
    public ytd_net_total?: number;
}