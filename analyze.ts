const file = Bun.file("./leaderboard.json")

const exists = await file.exists();

if (!exists) {
  console.error("Leaderboard file does not exist. Run `bun gather` first.");
  process.exit(0);
}

const leaderboard = await file.json() as { name: string; id: string; messages: number }[];
leaderboard.forEach((contact, index) => {
  const name = contact.name === "Unknown" ? contact.id : contact.name;
  console.log(`${index + 1}. ${name} (${contact.messages} messages)`);
});
