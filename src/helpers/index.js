const fs = require("fs");

const FileHelpers = {
	logToFile(logDirectory, logFileName, message) {
		if (!fs.existsSync(logDirectory)) {
			fs.mkdirSync(logDirectory, { recursive: true });
		}
		const logStream = fs.createWriteStream(`${logDirectory}/${logFileName}`, {
			flags: "a",
		});
		logStream.write(`${message}\n`);
		logStream.end();
	},
};

module.exports = FileHelpers;
