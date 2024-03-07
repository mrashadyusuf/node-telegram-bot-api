const TelegramBot = require("node-telegram-bot-api");

const token = "6549288841:AAEidMmFFwFIhzscl-XByKVec2LMz9yRoNw";
const bot = new TelegramBot(token, { polling: true });

// const chatId = '-4131053185' //group
const chatId = "7078296318"; //private
const userId = "7078296318";
const initialMessage = "Hello, this is a Telegram message sent from Node.js!";

// when bot received message
bot.on("message", async (msg) => {
  if (msg.text) {
    console.log("Chat ID:", msg.chat.id);
    console.log("User ID:", msg.from.id);

    if (msg.text.toString().toLowerCase().indexOf("hi") === 0) {
      bot.sendMessage(msg.chat.id, "Hello dear user");
    } else if (msg.text.toLowerCase() == "yes") {
      bot.sendMessage(chatId, "You chose Yes!");
    } else if (msg.text.toLowerCase() === "no") {
      bot.sendMessage(chatId, "You chose No!");
    } else if (msg.text.toString().toLowerCase().indexOf("html") === 0) {
      const htmlMessage = `
    <b>bold</b>, <strong>bold</strong>,
    <i>italic</i>, <em>italic</em>
    <a href="http://www.example.com/">inline URL</a>
    <code>inline fixed-width code</code>
    <pre>pre-formatted fixed-width code block</pre>
    `;

      bot.sendMessage(msg.chat.id, htmlMessage, { parse_mode: "HTML" });
    } else if (msg.text.toString().toLowerCase().indexOf("loc") === 0) {
      console.log("tet");
      bot.sendLocation(msg.chat.id, 44.97108, -104.27719);
      bot.sendMessage(msg.chat.id, "Here is the point");
    } else if (msg.text.toString().toLowerCase().indexOf("pic") === 0) {
      const photoUrl =
        "https://akcdn.detik.net.id/community/media/visual/2024/02/28/ilustrasi-1_169.jpeg";
      bot
        .sendPhoto(chatId, photoUrl)
        .then((sentPhoto) => {
          console.log("Photo sent:", sentPhoto);
        })
        .catch((error) => {
          console.error("Error sending photo:", error.message);
        });
    }
  } else if (msg.photo) {
    // Get information about the photo
    const photoId = msg.photo[msg.photo.length - 1].file_id;

    try {
      // Use the getFile method to get file information
      const fileDetails = await bot.getFile(photoId);

      // Construct the URL for viewing the image
      const fileURL = `https://api.telegram.org/file/bot${token}/${fileDetails.file_path}`;

      // Send the image URL as a message
      bot.sendMessage(chatId, `Here is the image: ${fileURL}`);
    } catch (error) {
      console.error("Error getting file details:", error.message);
      bot.sendMessage(chatId, "Error getting file details. Please try again.");
    }
  }
});

// Send the message
bot
  .sendMessage(chatId, initialMessage)
  .then((sentMessage) => console.log("Message sent:", sentMessage))
  .catch((error) => console.error("Error:", error));

// Listen for a command to /ask a yes or no question
bot.onText(/\/ask/, (msg) => {
  const chatId = msg.chat.id;

  // Send a message with a custom keyboard
  bot.sendMessage(chatId, "Do you want to proceed?", {
    reply_markup: {
      keyboard: [["Yes", "No"]],
      one_time_keyboard: true,
    },
  });
});

const options = {
  limit: 1, // Number of photos to retrieve (1 to 100)
  offset: 0, // Sequential index of the first photo to be returned
};

// Use getUserProfilePhotos method
bot
  .getUserProfilePhotos(userId, options)
  .then((userProfilePhotos) => {
    if (userProfilePhotos.total_count > 0) {
      const photoInfo = userProfilePhotos.photos[0][0];
      const fileId = photoInfo.file_id;

      // Use getFile method to get information about the file
      bot
        .getFile(fileId)
        .then((fileInfo) => {
          // Construct the URL for viewing the image
          const fileURL = `https://api.telegram.org/file/bot${token}/${fileInfo.file_path}`;
          console.log("Image URL:", fileURL);
        })
        .catch((error) => {
          console.error("Error getting file information:", error);
        });
    } else {
      console.log("User has no profile photos.");
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });
