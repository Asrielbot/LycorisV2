# OpenInnov Discord Bot

## Overview

This project is a Discord bot designed to assist a college class server. Its main features are to help manage communications, share documents, make announcements, arrange events, and facilitate study sessions and classes (including video calls). The bot is written in modern JavaScript (ESM) and uses the Discord.js library, with MongoDB for persistent storage.

---

## Project Structure

```
OpenInnov/
  commands/           # Individual command modules for the bot
  database/
    mongo.js          # MongoDB connection logic
  deployCommands.js   # (Likely) script to register commands with Discord
  events/             # Event handler modules (e.g., for messages, members, voice)
  features/           # Additional features (dynamic channels, FAQ, notes, onboarding)
  index.js            # Main entry point for the bot
  package.json        # Project dependencies and scripts
```

---

## How the Codebase Works

### 1. Entry Point (`index.js`)

- Loads environment variables using `dotenv/config`.
- Sets up a Discord client with the necessary intents and partials.
- Dynamically loads all command modules from the `commands/` directory and registers them.
- Dynamically loads all event handler modules from the `events/` directory and binds them to the client.
- Connects to MongoDB using a URI from the environment.
- Logs in to Discord using a token from the environment.

### 2. Commands

- Each file in `commands/` is expected to export a command object (likely with a `data` property for the command name).
- These are loaded and registered with the Discord client at startup.

### 3. Events

- Each file in `events/` exports a function that handles a specific Discord event (e.g., `guildMemberAdd`, `messageCreate`).
- These are bound to the client at startup.

### 4. Features

- The `features/` directory contains additional modules for specific bot features (dynamic channels, FAQ, notes, onboarding).
- These are not directly loaded in `index.js`, so they are likely imported by commands or event handlers as needed.

### 5. Database

- The bot connects to MongoDB using a helper in `database/mongo.js`.
- The connection string is expected to be provided via an environment variable.

---

## Configuration: What’s Required and What’s Missing

### Required Configuration

The bot expects the following environment variables:

- `DISCORD_TOKEN` — Your Discord bot token (from the Discord Developer Portal).
- `MONGO_URI` — The connection string for your MongoDB database.

### How Configuration is Loaded

- The code uses `dotenv/config`, which means it expects a `.env` file in the root of your project.
- This file should **not** be committed to version control (add `.env` to your `.gitignore`).

### Example `.env` File

Create a file named `.env` in the root of your project (same level as `index.js`):

```
DISCORD_TOKEN=your-bot-token-here
MONGO_URI=your-mongodb-uri-here
```


## Additional Notes

- The bot is modular: to add new commands or event handlers, simply add new files to the respective directories.
- The `features/` directory is for more complex or reusable logic that can be shared across commands/events.
- If you want to add role management (teachers, students, admin, delegates), you’ll likely want to add new commands and/or event handlers for role assignment and permissions.

---