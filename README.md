# `@ubiquibot/command-wallet`

Allows users to register their wallets to collect rewards.

## Technical Architecture

### Overview

Command Wallet is built as a serverless application using Cloudflare Workers, with a Supabase PostgreSQL database for data persistence. The application processes commands received through GitHub comments, manages wallet addresses, and provides a plugin system for extensibility.

### Key Components

#### 1. Worker (src/worker.ts)

- Entry point for the Cloudflare Worker
- Handles incoming HTTP requests
- Processes GitHub webhook events
- Manages environment variables and context

#### 2. Command Parser (src/handlers/command-parser.ts)

- Parses commands from GitHub comments
- Supports commands like:
  - Adding wallets
  - Querying wallet information
  - Managing wallet metadata
- Uses regex patterns for command recognition
- Validates command syntax and parameters

#### 3. Plugin System (src/plugin.ts)

- Provides extensibility through plugins
- Plugins can:
  - Process commands
  - Add new functionality
  - Integrate with external services
- Plugin interface defines:
  - Command processing
  - Error handling
  - Context management

#### 4. Database Layer (src/adapters/supabase)

- Uses Supabase as the PostgreSQL database provider
- Schema includes:
  - Wallet addresses
  - User associations
  - Metadata storage
- Helpers for:
  - Wallet management
  - Data validation
  - Query operations

#### 5. Testing Infrastructure

- Jest-based test suite
- Mock data and handlers for:
  - Database operations
  - GitHub events
  - Command processing
- HTTP request testing capabilities

### Data Flow

1. GitHub comment webhook triggers the Worker
2. Worker validates the request and extracts command
3. Command parser identifies and validates the command
4. Plugin system processes the command
5. Database operations are performed if needed
6. Response is sent back to GitHub

## Prerequisites

- A good understanding of how the [kernel](https://github.com/ubiquity/ubiquibot-kernel) works and how to interact with it.
- A basic understanding of the Ubiquibot configuration and how to define your plugin's settings.

## Getting Started

1. Install the dependencies preferably using `bun`.
2. Copy `.dev.vars.example` to `.dev.vars` and fill the variables
3. Generate Supabase types by running
   ```shell
   bun prebuild
   ```
4. Run the project with `bun wrangler`

## Example configuration

```yml
- plugin: https://ubiquibot-command-wallet.ubiquity.workers.dev
  id: command-wallet
  with:
    registerWalletWithVerification: false
```

###### At this stage, your plugin will fire on your defined events with the required settings passed in from the kernel. You can now start writing your plugin's logic.

5. Start building your plugin by adding your logic to the [plugin.ts](./src/plugin.ts) file.

## Testing a plugin

### Worker Plugins

- `yarn/bun worker` - to run the worker locally.
- To trigger the worker, `POST` requests to http://localhost:4000/ with an event payload similar to:

```ts
await fetch("http://localhost:4000/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    stateId: "",
    eventName: "",
    eventPayload: "",
    settings: "",
    ref: "",
    authToken: "",
  }),
});
```

A full example can be found [here](https://github.com/ubiquibot/assistive-pricing/blob/623ea3f950f04842f2d003bda3fc7b7684e41378/tests/http/request.http).

### Action Plugins

- Ensure the kernel is running and listening for events.
- Fire an event in/to the repo where the kernel is installed. This can be done in a number of ways, the easiest being via the GitHub UI or using the GitHub API, such as posting a comment, opening an issue, etc in the org/repo where the kernel is installed.
- The kernel will process the event and dispatch it using the settings defined in your `.ubiquibot-config.yml`.
- The `action.yml` workflow will run and execute your plugin's logic.
- You can view the logs in the Actions tab of your repo.

[Nektos Act](https://github.com/nektos/act) - a tool for running GitHub Actions locally.

## More information

- [Full Ubiquibot Configuration](https://github.com/ubiquity/ubiquibot/blob/0fde7551585499b1e0618ec8ea5e826f11271c9c/src/types/configuration-types.ts#L62) - helpful for defining your plugin's settings as they are strongly typed and will be validated by the kernel.
- [Ubiquibot V1](https://github.com/ubiquity/ubiquibot) - helpful for porting V1 functionality to V2, helper/utility functions, types, etc. Everything is based on the V1 codebase but with a more modular approach. When using V1 code, keep in mind that most all code will need refactored to work with the new V2 architecture.

## Examples

- [Start/Stop Slash Command](https://github.com/ubq-testing/start-stop-module) - simple
- [Assistive Pricing Plugin](https://github.com/ubiquibot/assistive-pricing) - complex
- [Conversation Rewards](https://github.com/ubiquibot/conversation-rewards) - really complex
