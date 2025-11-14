#!/usr/bin/env bun
/**
 * Bulk Sender Bot - Send the same message to multiple recipients
 *
 * Usage:
 *   bun examples/bulk-sender-bot.ts <message> <recipient1> <recipient2> ...
 *
 * Examples:
 *   bun examples/bulk-sender-bot.ts "Happy New Year!" "+1234567890" "+0987654321" "user@example.com"
 */

import { IMessageSDK } from '../src'

// Get command line arguments
const args = process.argv.slice(2)

if (args.length < 2) {
    console.error('Usage: bun examples/bulk-sender-bot.ts <message> <recipient1> <recipient2> ...')
    console.error('Example: bun examples/bulk-sender-bot.ts "Hello!" "+1234567890" "+0987654321"')
    process.exit(1)
}

const message = args[0]
const recipients = args.slice(1)

console.log('📤 Bulk Message Sender')
console.log(`📝 Message: ${message}`)
console.log(`👥 Recipients: ${recipients.length}`)
console.log()

try {
    const sdk = new IMessageSDK({
        debug: false,
        maxConcurrent: 3 // Send to 3 recipients at a time
    })

    // Prepare batch messages
    const batch = recipients.map(recipient => ({
        to: recipient,
        content: message
    }))

    console.log('Sending messages...\n')

    // Send using batch API
    await sdk.sendBatch(batch)

    console.log('\n✅ All messages sent successfully!')
    console.log(`📊 Total sent: ${recipients.length}`)

    await sdk.close()
} catch (error) {
    console.error('❌ Error sending messages:', error)
    process.exit(1)
}
