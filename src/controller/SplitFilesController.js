const config = require("../../config.json");
const SplitFilesModel = require("../model/SplitFilesModel");
const { logToFile } = require("../utils");
const INPUT_FOLDER = config.inputFolder;
const OUTPUT_FOLDER = config.outputFolder;
const SPLITED_FILES_FOLDER = config.splitedFilesFolder;
const RECORD_LOG_Y_N = config.recordLogs;
const LOG_FOLDER = config.logFolder;
const LOG_TYPE = config.logType;

const SplitFilesController = {
	splitFilesSevenPDV() {
		try {
			let files = SplitFilesModel.getFiles(INPUT_FOLDER);

			if (!files.length) {
				return;
			}

			files.forEach((file) => {
				let splitedFiles = SplitFilesModel.splitFile(file);

				if (!splitedFiles.length) {
					SplitFilesModel.moveFile(file.fileName, INPUT_FOLDER, OUTPUT_FOLDER);
					RECORD_LOG_Y_N && LOG_TYPE === 1
						? logToFile(
								LOG_FOLDER,
								`log_SplitSevenPDV.log`,
								`INFO: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} - The file ${
									file.fileName
								} does not need to be split!`
						  )
						: null;
					return;
				}

				splitedFiles.forEach((splitedFile) => {
					SplitFilesModel.createSplitedFile(
						splitedFile.fileName,
						splitedFile.content,
						OUTPUT_FOLDER
					);
				});

				SplitFilesModel.moveFile(
					file.fileName,
					INPUT_FOLDER,
					SPLITED_FILES_FOLDER
				);
				RECORD_LOG_Y_N && LOG_TYPE === 1
					? logToFile(
							LOG_FOLDER,
							`log_SplitSevenPDV.log`,
							`INFO: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} - Original file: ${
								file.fileName
							}\n Chuncks:${splitedFiles.map(
								(splitedFile) => "\n" + splitedFile.fileName
							)}`
					  )
					: null;
				return;
			});
		} catch (error) {
			throw new Error(error);
		}
	},
};

module.exports = SplitFilesController;
