#!/usr/bin/env bun
/**
 * CLI Bot - Send messages from terminal
 *
 * Usage:
 *   bun examples/cli-bot.ts <recipient> <message>
 *
 * Examples:
 *   bun examples/cli-bot.ts "+1234567890" "Hello from CLI!"
 *   bun examples/cli-bot.ts "user@example.com" "Testing the bot"
 */

import { IMessageSDK } from '../src'

// Get command line arguments
const args = process.argv.slice(2)

if (args.length < 2) {
    console.error('Usage: bun examples/cli-bot.ts <recipient> <message>')
    console.error('Example: bun examples/cli-bot.ts "+1234567890" "Hello from CLI!"')
    process.exit(1)
}

const recipient = args[0]
const message = args.slice(1).join(' ')

console.log(`📤 Sending message to ${recipient}...`)
console.log(`📝 Message: ${message}`)

try {
    const sdk = new IMessageSDK({
        debug: false
    })

    await sdk.send(recipient, message)

    console.log('✅ Message sent successfully!')

    await sdk.close()
} catch (error) {
    console.error('❌ Error sending message:', error)
    process.exit(1)
}
