# iMessage Leaderboard with Bun.sh

To get started...

```bash
git clone https://github.com/eiiot/imessage-leaderboard.git
cd imessage-leaderboard
```

Install `bun` if you don't have it:

```bash
curl -fsSL https://bun.sh/install | bash
```

Install dependencies:

```bash
bun install
```

To create `leaderboard.json`:

1. Grant "Full Disk Access" to Terminal.app in System Preferences > Security & Privacy > Privacy > Full Disk Access
2. Open Messages.app
3. Run:

```bash
bun gather
```

You may need to grant access to contacts when the script runs.

To analyze `leaderboard.json`:

```bash
bun analyze | tee leaderboard.md
```

You can view the leaderboard in Markdown format at `leaderboard.md`.
