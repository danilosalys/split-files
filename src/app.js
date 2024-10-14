const express = require("express");
const Consul = require("consul");
const os = require("os");
const process = require("process");
process.title = "Split Files SevenPDV";
const cron = require("node-cron");


const config = require("../config.json");
const SplitFilesController = require("./controller/SplitFilesController");
const { logToFile } = require("./utils");


const RECORD_LOG_Y_N = config.recordLogs;
const LOG_FOLDER = config.logFolder;
const INTERVAL_CHECK_FOLDER = config.timeIntervalCheckFolder;


const app = express();

const port = process.env.PORT || 3000;

const consul = new Consul({
  host: "127.0.0.1",
  port: 8500,
  promisify: true,
});

const serviceId = `split-files-service`;
consul.agent.service.register(
  {
    id: serviceId,
    name: "Split Files SevenPDV Service",
    address: "localhost",
    port: port,
    check: {
      http: `http://127.0.0.1:${port}/health/dc-split-files-sevenpdv`,
      interval: "10s",
      timeout: "5s",
      notes: "Verifica se o serviço esta rodando",
    },
  },
  (err) => {
    if (err) throw err;
    console.log(`Serviço registrado no Consul com o ID: ${serviceId}`);
  }
);

app.get("/health/dc-split-files-sevenpdv", (req, res) => {
  const memUsage = process.memoryUsage();
  const cpuLoad = os.loadavg();
  const uptimeInSeconds = process.uptime();

 
  const bytesToMB = (bytes) => (bytes / 1024 / 1024).toFixed(2);

  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  };
  res.json({
    status: "UP",
    host: {
      hostname: os.hostname(),
    },
    memoryUsage: {
      pid: process.pid,
      rss: `${bytesToMB(memUsage.rss)} MB`,
      heapTotal: `${bytesToMB(memUsage.heapTotal)} MB`,
      heapUsed: `${bytesToMB(memUsage.heapUsed)} MB`,
    },
    cpu: {
      loadAverage: {
        "1m": cpuLoad[0].toFixed(2),
        "5m": cpuLoad[1].toFixed(2),
        "15m": cpuLoad[2].toFixed(2),
      },
      cores: os.cpus().length,
    },
  });
});

let splitFilesIsRunningNow = false;

const runSplitFilesSevenPDV = () => {
  if (splitFilesIsRunningNow) {
    console.log(new Date().toLocaleString());
    console.log(
      new Date().toLocaleTimeString() + " - The last execution is not over yet!"
    );
    return;
  }
  try {
    splitFilesIsRunningNow = true;
    SplitFilesController.splitFilesSevenPDV();
  } catch (error) {
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

app.listen(port, () => {
  console.log(`Split Files Service rodando na porta ${port}`);
});

process.on("SIGINT", () => {
  consul.agent.service.deregister(serviceId, (err) => {
    if (err) throw err;
    console.log(`Serviço com ID: ${serviceId} desregistrado do Consul`);
    process.exit();
  });
});
