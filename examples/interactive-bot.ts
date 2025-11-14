#!/usr/bin/env bun
/**
 * Interactive Bot - Send messages from terminal interactively
 *
 * Usage:
 *   bun examples/interactive-bot.ts
 *
 * Commands:
 *   /send <recipient> <message>  - Send a message
 *   /to <recipient>              - Set default recipient
 *   /list                        - List recent chats
 *   /help                        - Show help
 *   /quit                        - Exit the bot
 *
 * When a default recipient is set, you can just type the message directly.
 */

import { IMessageSDK } from '../src'
import * as readline from 'readline'

const sdk = new IMessageSDK({
    debug: false
})

let defaultRecipient: string | null = null

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
})

console.log('🤖 Interactive Texting Bot')
console.log('Type /help for commands\n')

function showHelp() {
    console.log('\n📚 Available Commands:')
    console.log('  /send <recipient> <message>  - Send a message to a recipient')
    console.log('  /to <recipient>              - Set default recipient for quick messages')
    console.log('  /list                        - List your recent chats')
    console.log('  /help                        - Show this help message')
    console.log('  /quit                        - Exit the bot')
    console.log('\nWhen a default recipient is set, just type your message directly.')
    console.log('Examples:')
    console.log('  /to +1234567890')
    console.log('  Hello there!                 (sends to +1234567890)')
    console.log('  /send user@example.com Hi!   (sends to user@example.com)\n')
}

async function handleCommand(line: string) {
    const trimmed = line.trim()

    if (!trimmed) {
        rl.prompt()
        return
    }

    // Handle commands
    if (trimmed.startsWith('/')) {
        const parts = trimmed.split(' ')
        const command = parts[0].toLowerCase()

        switch (command) {
            case '/help':
                showHelp()
                break

            case '/quit':
            case '/exit':
                console.log('\n👋 Goodbye!')
                await sdk.close()
                process.exit(0)
                break

            case '/to': {
                if (parts.length < 2) {
                    console.error('❌ Usage: /to <recipient>')
                } else {
                    defaultRecipient = parts[1]
                    console.log(`✅ Default recipient set to: ${defaultRecipient}`)
                }
                break
            }

            case '/send': {
                if (parts.length < 3) {
                    console.error('❌ Usage: /send <recipient> <message>')
                } else {
                    const recipient = parts[1]
                    const message = parts.slice(2).join(' ')
                    await sendMessage(recipient, message)
                }
                break
            }

            case '/list': {
                try {
                    console.log('\n📋 Recent Chats:')
                    const chats = await sdk.listChats({ limit: 10 })
                    if (chats.length === 0) {
                        console.log('  No chats found')
                    } else {
                        for (const chat of chats) {
                            const unread = chat.unreadCount > 0 ? ` (${chat.unreadCount} unread)` : ''
                            console.log(`  • ${chat.displayName}${unread}`)
                            if (chat.isGroup) {
                                console.log(`    ChatID: ${chat.chatId}`)
                            }
                        }
                    }
                    console.log()
                } catch (error) {
                    console.error('❌ Error listing chats:', error)
                }
                break
            }

            default:
                console.error(`❌ Unknown command: ${command}`)
                console.log('Type /help for available commands')
        }
    } else {
        // Regular message - send to default recipient if set
        if (defaultRecipient) {
            await sendMessage(defaultRecipient, trimmed)
        } else {
            console.error('❌ No default recipient set. Use /to <recipient> or /send <recipient> <message>')
        }
    }

    rl.prompt()
}

async function sendMessage(recipient: string, message: string) {
    try {
        console.log(`📤 Sending to ${recipient}...`)
        await sdk.send(recipient, message)
        console.log('✅ Message sent!')
    } catch (error) {
        console.error('❌ Error sending message:', error)
    }
}

// Handle user input
rl.on('line', async (line) => {
    await handleCommand(line)
})

// Handle Ctrl+C
rl.on('close', async () => {
    console.log('\n👋 Goodbye!')
    await sdk.close()
    process.exit(0)
})

// Show initial prompt
rl.prompt()
