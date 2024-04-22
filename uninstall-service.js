let Service = require("node-windows").Service;
let svc = new Service({
	name: "SplitFilesSevenPDV",
	description:
		"Serviço para efetuar a quebra de lotes da SevenPDV para melhoria o processamento!",
	script: "C:\\projetos-drogacenter\\dc-split-files-sevenpdv\\src\\app.js",
});
svc.on("uninstall", function () {
	console.log("Uninstall complete.");
});
svc.uninstall();
