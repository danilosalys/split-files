const SplitFilesController = require("../controller/SplitFilesController");
const SplitFilesModel = require("../model/SplitFilesModel");

describe("SplitFilesController", () => {
	describe("splitFilesSevenPDV", () => {
		test("deve chamar SplitFilesModel.splitFile() para cada arquivo", () => {
			const mockFiles = [
				{ fileName: "file1.txt", contentFile: "content1" },
				{ fileName: "file2.txt", contentFile: "content2" },
			];
			jest.spyOn(SplitFilesModel, "getFiles").mockReturnValue(mockFiles);
			jest.spyOn(SplitFilesModel, "splitFile").mockReturnValue([]);

			SplitFilesController.splitFilesSevenPDV();

			expect(SplitFilesModel.splitFile).toHaveBeenCalledTimes(mockFiles.length);
			expect(SplitFilesModel.splitFile).toHaveBeenCalledWith(mockFiles[0]);
			expect(SplitFilesModel.splitFile).toHaveBeenCalledWith(mockFiles[1]);
		});
	});
});
