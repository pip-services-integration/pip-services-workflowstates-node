

import { FilterParams } from "pip-services3-commons-node";
import { WorkflowStatusV1 } from "../data/version1/WorkflowStatusV1";

export class QueryAnalyzer {
    public static toStringArray(value: string): string[] {
        if (value == null) {
            return null;
        }

        var items = value.split(',').filter((el)=>{ return el != null || !el.trim()}); 
        return items.length > 0 ? items : null;
    }

    public static isOpenQuery(filter: FilterParams): boolean {
        if (filter == null || filter.length() == 0) {
            return false;
        }

        if (filter.get("truncate_time")) { 
            return false;
        }

        if (filter.get("compensated") == null || filter.get("expired") == null) { 
            return true;
        }

        var workflowState = filter.getAsNullableString("workflow_state") ?? filter.getAsNullableString("state");
        if (workflowState != null) {
            return workflowState != WorkflowStatusV1.Completed && workflowState != WorkflowStatusV1.Aborted;
        }

        var workflowStates = this.toStringArray(filter.getAsNullableString("workflow_states") ?? filter.getAsNullableString("states"));
        if (workflowStates != null && workflowStates.length > 0) {
            return workflowStates.indexOf(WorkflowStatusV1.Completed) < 0 && workflowStates.indexOf(WorkflowStatusV1.Aborted) < 0;
        }

        return false;
    }
}

