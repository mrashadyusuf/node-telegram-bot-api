const TelegramBot = require("node-telegram-bot-api");

const botToken = "6549288841:AAEidMmFFwFIhzscl-XByKVec2LMz9yRoNw";
const bot = new TelegramBot(botToken, { polling: true });

// Store user states for conversation flow
const userStates = new Map();

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // Set the initial state for the user
  userStates.set(userId, "WAITING_FOR_OPTION");

  // Send the initial message with options
  sendOptionsMessage(chatId, userId);
});

bot.on("callback_query", (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const userId = callbackQuery.from.id;
  const data = callbackQuery.data;

  // Check the user's state
  const currentState = userStates.get(userId) || "WAITING_FOR_OPTION";

  // Handle different options based on the callback data
  switch (currentState) {
    case "WAITING_FOR_OPTION":
      handleWaitingForOption(chatId, userId, data);
      break;
    default:
      // Handle other states if needed
      break;
  }
});

// Function to handle user choosing an option
function handleWaitingForOption(chatId, userId, chosenOption) {
  // Respond based on the chosen option
  switch (chosenOption) {
    case "option_1":
      sendOptionsMessage(chatId, userId, ["Option 1.1", "Option 1.2"]);
      // Set a new state for the next question
      userStates.set(userId, "WAITING_FOR_ANOTHER_OPTION");
      break;
    // Add more cases for different options if needed
    default:
      bot.sendMessage(chatId, "Invalid option.");
      break;
  }
}

// Function to send a message with options
function sendOptionsMessage(
  chatId,
  userId,
  options = ["Option 1", "Option 2"]
) {
  const inlineKeyboard = options.map((option, index) => [
    { text: option, callback_data: `option_${index + 1}` },
  ]);

  const replyMarkup = { inline_keyboard: inlineKeyboard };

  // Send the message with options
  bot.sendMessage(chatId, "Choose an option:", { reply_markup: replyMarkup });
}
