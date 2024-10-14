let Service = require("node-windows").Service;
let svc = new Service({
	name: "Mercanet Split Files Seven PDV",
	description:
		"Serviço para efetuar a quebra de lotes da SevenPDV para melhoria o processamento no Mercanet!",
	script: "C:\\projetos-drogacenter\\dc-services-nodejs\\dc-split-files-sevenpdv\\src\\app.js",
});
svc.on("install", function () {
	svc.start();
});
svc.install();
