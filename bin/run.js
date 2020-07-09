let WorkflowStatesProcess = require('../obj/src/container/WorkflowStatesProcess').WorkflowStatesProcess;

try {
    new WorkflowStatesProcess().run(process.argv);
} catch (ex) {
    console.error(ex);
}
