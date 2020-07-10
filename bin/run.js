let ProcessStatesProcess = require('../obj/src/container/ProcessStatesProcess').ProcessStatesProcess;

try {
    new ProcessStatesProcess().run(process.argv);
} catch (ex) {
    console.error(ex);
}
