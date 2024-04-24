process.title = "Split Files SevenPDV";

const config = require("../config.json");
const SplitFilesController = require("./controller/SplitFilesController");
const { logToFile } = require("./utils");
const cron = require("node-cron");
const RECORD_LOG_Y_N = config.recordLogs;
const LOG_FOLDER = config.logFolder;
const INTERVAL_CHECK_FOLDER = config.timeIntervalCheckFolder;

let splitFilesIsRunningNow = false;

const runSplitFilesSevenPDV = () => {
	if (splitFilesIsRunningNow) {
		console.log(new Date().toLocaleString());
		console.log(
			new Date().toLocaleTimeString() + " - The last execution is not over yet"
		);
		return;
	}
	try {
		splitFilesIsRunningNow = true;
		SplitFilesController.splitFilesSevenPDV();
	} catch (error) {
		console.log(error);
		RECORD_LOG_Y_N
			? logToFile(
					LOG_FOLDER,
					`log_SplitSevenPDV.log`,
					`ERROR: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} - Error executing the program ${JSON.stringify(
						error
					)}`
			  )
			: null;
	} finally {
		splitFilesIsRunningNow = false;
	}
};
console.log(
	`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} - Aplication running!`
);
cron.schedule(`*/${INTERVAL_CHECK_FOLDER} * * * *`, runSplitFilesSevenPDV);
