import { Database } from "bun:sqlite";
import { getContactName } from "./contacts";

console.log("Reading database...");

const db = new Database("~/Library/Messages/chat.db", { readonly: true });

console.log("Reading conversations...");

const conversationsWithMessageCount = db
  .query(
    "select chat.chat_identifier, count (*) AS message_count from chat join chat_message_join on chat.ROWID = chat_message_join.chat_id join message on chat_message_join.message_id = message.ROWID group by chat.chat_identifier order by message_count desc"
  )
  .all() as {
    chat_identifier: string;
    message_count: number;
    user_name: string;
  }[];

console.log("Done reading conversations.");

console.log("Identifying contacts. This may take a while...")

const leaderboard = [] as { name: string; id: string; messages: number }[];

let done = 0;

const promises = conversationsWithMessageCount.map(async (conversation, index) => {
  const { chat_identifier, message_count } = conversation;

  try {
    const contactName = await getContactName(chat_identifier);
    leaderboard.push({
      name: contactName,
      id: chat_identifier,
      messages: message_count
    });

    console.log('Done with', ++done, "of", conversationsWithMessageCount.length, `contacts (${Math.round(done / conversationsWithMessageCount.length * 100)}%)`);
  } catch (e) {
    console.error(`Error with contact ${index}: `, e);
  }
});

Promise.allSettled(promises).then(() => {
  console.log("Sorting leaderboard...");

  const sortedLeaderboard = leaderboard.sort((a, b) => b.messages - a.messages);

  console.log("Writing to file...");

  Bun.write("./leaderboard.json", JSON.stringify(sortedLeaderboard, null, 2));

  console.log("Done!");
  console.log("run `bun analyze` to see the results");
}).catch(err => {
  console.error("Error with Promise.all: ", err);
});
