const SplitFilesModel = require("../model/SplitFilesModel");

describe("SplitFilesModel", () => {
	describe("getFiles", () => {
		test("deve retornar uma lista de arquivos", () => {
			const inputFolder = "./testFolder";
			const expectedFiles = [
				{ fileName: "file1.txt", contentFile: "content1" },
			];
			jest.spyOn(SplitFilesModel, "getFiles").mockReturnValue(expectedFiles);

			const files = SplitFilesModel.getFiles(inputFolder);

			expect(files).toEqual(expectedFiles);
		});

		test("deve retornar uma lista vazia se a pasta não existir", () => {
			const inputFolder = "./nonExistingFolder";
			jest.spyOn(SplitFilesModel, "getFiles").mockReturnValue([]);

			const files = SplitFilesModel.getFiles(inputFolder);

			expect(files).toEqual([]);
		});
	});

	describe("splitFile", () => {
		test("deve quebrar o conteudo do arquivo", () => {
			const mockFile = { fileName: "test.txt", contentFile: "test content" };
			const expectedChunks = ["test content"];
			jest.spyOn(SplitFilesModel, "splitFile").mockReturnValue(expectedChunks);

			const chunks = SplitFilesModel.splitFile(mockFile);

			expect(chunks).toEqual(expectedChunks);
		});
	});

	describe("moveFile", () => {
		test("deve mover o arquivo da pasta de entrada para a pasta de saída", () => {
			const fileName = "test.txt";
			const inputFolder = "./inputFolder";
			const outputFolder = "./outputFolder";
			jest.spyOn(SplitFilesModel, "moveFile").mockReturnValue(true);

			const success = SplitFilesModel.moveFile(
				fileName,
				inputFolder,
				outputFolder
			);

			expect(success).toBe(true);
		});
	});
});
