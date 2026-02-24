const axios = require("axios");
const config = require("../config");

async function sendTelegramMessage(text) {
  try {
    const token = config.telegram.botToken;
    const chatId = config.telegram.chatId;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    await axios.post(url, {
      chat_id: chatId,
      // text: text,
      text: "test message",
      parse_mode: "HTML",
      disable_web_page_preview: false
    }, {
      timeout: 10000
    });

    console.log("Telegram message sent");

  } catch (error) {
    console.error("Telegram send error:", error.message);
    throw error;
  }
}

module.exports = {
  sendTelegramMessage
};