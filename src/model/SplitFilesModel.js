const config = require("../../config.json");
const { logToFile } = require("../utils");
const path = require("path");
const fs = require("fs");
const QTY_LINES_SPLIT = config.qtyLinesSplit;
const GROUP_BY_ONLY_CNPJ = config.groupOrdersByOnlyCNPJ;
const RECORD_LOG_Y_N = config.recordLogs;
const LOG_FOLDER = config.logFolder;

const SplitFilesModel = {
	getFiles(inputFolder) {
		try {
			let folder = path.resolve(inputFolder);
			let files = [];

			if (!fs.existsSync(folder)) {
				RECORD_LOG_Y_N
					? logToFile(
							LOG_FOLDER,
							`log_SplitSevenPDV.log`,
							`ERROR: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} - The folder "${folder}" does not exist. Check settings!`
					  )
					: null;
				return [];
			}
			let contentFolder = fs.readdirSync(folder);
			contentFolder.forEach((file) => {
				const fullPathFile = path.join(folder, file);
				if (fs.statSync(fullPathFile).isFile()) {
					const contentFile = fs.readFileSync(fullPathFile, "utf-8");
					files.push({ fileName: file, contentFile: contentFile });
				}
			});
			return files;
		} catch (error) {
			throw new Error("Error listing files", error);
		}
	},

	splitFile(file) {
		try {
			let splitedFiles = [];
			let lines = file.contentFile.split("\n");
			let qtyLines = file.contentFile.split("\n").length - 1;
			let baseFileName = file.fileName.substring(0, 38);
			let extensionFileName = file.fileName.substring(45, 48);

			if (file.fileName.length === 48) {
				if (qtyLines > QTY_LINES_SPLIT) {
					let countLines = 1;
					let countFiles = 0;
					let contentSplitedFile = [];

					lines.forEach((line, index, linesArray) => {
						let nextLine = linesArray[index + 1];
						let keyField = 0;
						let nextKeyField = 0;

						if (!GROUP_BY_ONLY_CNPJ) {
							keyField = line.substring(0, 14) + line.substring(47, 61);
							nextKeyField = nextLine
								? nextLine.substring(0, 14) + nextLine.substring(47, 61)
								: null;
						} else {
							keyField = line.substring(0, 14);
							nextKeyField = nextLine ? nextLine.substring(0, 14) : 0;
						}
						contentSplitedFile.push(line + "\n");

						if (
							(countLines > QTY_LINES_SPLIT && keyField !== nextKeyField) ||
							(!nextKeyField && keyField)
						) {
							countFiles++;
							let nameSplitedFile = `${baseFileName}${countLines
								.toString()
								.padStart(6, "0")}.${extensionFileName}_${
								index + 1 - countLines + 1
							}`;
							splitedFiles.push({
								fileName: nameSplitedFile,
								content: contentSplitedFile,
							});

							countLines = 0;
							contentSplitedFile = [];
						}

						countLines++;
					});
				}
			} else {
				RECORD_LOG_Y_N
					? logToFile(
							LOG_FOLDER,
							`log_SplitSevenPDV.log`,
							`ERROR: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} - The file name ${
								file.fileName
							} is invalid for SevenPDV`
					  )
					: null;
			}

			return splitedFiles;
		} catch (error) {
			throw new Error(`Error splitting file ${file.fileName}!`, error);
		}
	},

	moveFile(fileName, inputFolder, outputFolder) {
		try {
			const inputFilePath = path.join(inputFolder, fileName);
			const outputFilePath = path.join(outputFolder, fileName);
			fs.renameSync(inputFilePath, outputFilePath);
			return true;
		} catch (error) {
			RECORD_LOG_Y_N
				? logToFile(
						LOG_FOLDER,
						`log_SplitSevenPDV.log`,
						`ERROR: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} - Error moving file ${fileName}!, ${error}`
				  )
				: null;
			throw new Error(`Error moving file ${fileName}!, error`);
		}
	},
	createSplitedFile(fileName, contentFile, outputFolder) {
		try {
			const outputFilePath = path.join(outputFolder, fileName);
			const content = contentFile.join("");
			fs.writeFileSync(outputFilePath, content);
			return true;
		} catch (error) {
			RECORD_LOG_Y_N
				? logToFile(
						LOG_FOLDER,
						`log_SplitSevenPDV.log`,
						`ERROR: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} - Error creating file ${fileName}!, ${error}`
				  )
				: null;
			throw new Error(`Error creating file ${fileName}`, error);
		}
	},
};

module.exports = SplitFilesModel;
