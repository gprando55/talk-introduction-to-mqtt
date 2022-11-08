import os from "node:os";

export const getSystemData = () => ({
  loadavg: os.loadavg(),
  freemem: os.freemem(),
  cpus: os.cpus()[0].speed,
  cpuUsage: process.cpuUsage(),
  memoryUsage: process.memoryUsage()
});


