const cron = require("node-cron");
const telegramJob = require("./telegram.job");

console.log("Cron scheduler started");

// هر 10 دقیقه
// cron.schedule("*/10 * * * *", async () => {
//   console.log("Running telegram cron...");
//   await telegramJob();
// });


// telegramJob();