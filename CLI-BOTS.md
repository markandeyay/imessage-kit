# CLI Texting Bots

This guide covers the command-line texting bots built with iMessage Kit. These bots allow you to send messages directly from your terminal.

## Prerequisites

- macOS system with iMessage configured
- Full Disk Access permission granted to your terminal (see main README)
- Bun or Node.js installed

## Available Bots

### 1. CLI Bot (Simple Command-Line Sender)

Send a single message from the command line.

**Usage:**
```bash
bun examples/cli-bot.ts <recipient> <message>
```

**Examples:**
```bash
# Send to phone number
bun examples/cli-bot.ts "+1234567890" "Hello from the terminal!"

# Send to email
bun examples/cli-bot.ts "user@example.com" "Quick message"

# Multi-word messages
bun examples/cli-bot.ts "+1234567890" "This is a longer message with spaces"
```

**Features:**
- Simple one-command messaging
- Works with phone numbers, emails, and chat IDs
- Quick feedback on send status

---

### 2. Interactive Bot (Continuous Messaging)

Interactive terminal interface for sending multiple messages.

**Usage:**
```bash
bun examples/interactive-bot.ts
```

**Available Commands:**

| Command | Description | Example |
|---------|-------------|---------|
| `/send <recipient> <message>` | Send a message to any recipient | `/send +1234567890 Hello!` |
| `/to <recipient>` | Set default recipient for quick messaging | `/to +1234567890` |
| `/list` | List your recent chats | `/list` |
| `/help` | Show help message | `/help` |
| `/quit` | Exit the bot | `/quit` |

**Quick Messaging:**

Once you set a default recipient with `/to`, you can send messages directly:

```
> /to +1234567890
✅ Default recipient set to: +1234567890
> Hello there!
✅ Message sent!
> How are you?
✅ Message sent!
```

**Full Example Session:**
```
🤖 Interactive Texting Bot
Type /help for commands

> /list
📋 Recent Chats:
  • John Doe (2 unread)
  • Jane Smith
  • Work Group
    ChatID: chat45e2b868ce1e43da89af262922733382

> /to +1234567890
✅ Default recipient set to: +1234567890

> Hey! Testing the bot
✅ Message sent!

> /send user@example.com Quick message to someone else
✅ Message sent!

> /quit
👋 Goodbye!
```

---

### 3. Bulk Sender Bot (Mass Messaging)

Send the same message to multiple recipients at once.

**Usage:**
```bash
bun examples/bulk-sender-bot.ts <message> <recipient1> <recipient2> <recipient3> ...
```

**Examples:**
```bash
# Send to multiple phone numbers
bun examples/bulk-sender-bot.ts "Meeting at 3pm!" "+1234567890" "+0987654321" "+1112223333"

# Mix phone numbers and emails
bun examples/bulk-sender-bot.ts "Happy New Year!" "+1234567890" "user@example.com" "friend@icloud.com"
```

**Features:**
- Concurrent sending (3 messages at a time by default)
- Progress tracking
- Error handling per recipient

---

## Advanced Usage

### Using with Node.js

If you prefer Node.js over Bun:

```bash
# Make sure better-sqlite3 is installed
npm install better-sqlite3

# Run with tsx or ts-node
npx tsx examples/cli-bot.ts "+1234567890" "Hello!"
```

### Sending to Group Chats

First, get the group chat ID:

```bash
bun examples/interactive-bot.ts
> /list
📋 Recent Chats:
  • Work Group
    ChatID: chat45e2b868ce1e43da89af262922733382
```

Then use the chat ID:

```bash
# With CLI bot
bun examples/cli-bot.ts "chat45e2b868ce1e43da89af262922733382" "Hello team!"

# With interactive bot
> /send chat45e2b868ce1e43da89af262922733382 Team update!
```

### Sending Images and Files

To send images or files, modify the bots to use the object syntax:

```typescript
// In cli-bot.ts or interactive-bot.ts, change:
await sdk.send(recipient, message)

// To:
await sdk.send(recipient, {
    text: message,
    images: ['path/to/image.jpg'],
    files: ['path/to/document.pdf']
})
```

---

## Creating Your Own Bot

### Basic Template

```typescript
#!/usr/bin/env bun
import { IMessageSDK } from '@photon-ai/imessage-kit'

const sdk = new IMessageSDK({
    debug: false
})

// Your bot logic here
await sdk.send('+1234567890', 'Hello!')

await sdk.close()
```

### Auto-Reply Bot

See `examples/08-auto-reply.ts` for a bot that automatically replies to incoming messages.

### Scheduled Messages

Combine with cron or a scheduler:

```bash
# Add to crontab
0 9 * * * /usr/local/bin/bun /path/to/cli-bot.ts "+1234567890" "Good morning!"
```

---

## Troubleshooting

### Permission Denied

Make sure your terminal has Full Disk Access:
1. System Settings → Privacy & Security → Full Disk Access
2. Add your terminal application

### Messages Not Sending

1. Check that iMessage is configured and working on your Mac
2. Verify the recipient format (include country code for phone numbers: `+1234567890`)
3. Enable debug mode: `new IMessageSDK({ debug: true })`

### Recipient Not Found

- For phone numbers, use international format: `+1234567890`
- For group chats, use the exact chat ID from `/list`
- Ensure you have an existing conversation with the recipient

---

## Tips

1. **Phone Number Format**: Always use international format with `+` prefix
2. **Group Chats**: Get chat IDs from `/list` command in interactive bot
3. **Rate Limiting**: The bulk sender limits to 3 concurrent sends to avoid overwhelming the system
4. **Debugging**: Add `debug: true` to SDK initialization for detailed logs

---

## Example Use Cases

- **Daily Reminders**: Script daily messages to family/team
- **Alert System**: Send notifications from monitoring scripts
- **Bulk Announcements**: Send updates to multiple recipients
- **Quick Messaging**: Fast terminal-based messaging without opening Messages app
- **Automation**: Integrate with other scripts and workflows

---

For more advanced features like auto-reply, message watching, and webhooks, see the main README and other examples.
