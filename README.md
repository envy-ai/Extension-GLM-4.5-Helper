# GLM 4.5 Helper Extension

A SillyTavern extension that ensures GLM 4.5 pays attention to system messages by automatically converting the final 'system' role message to 'user' role in Chat Completion API requests.

## Features

- **Automatic Role Conversion**: Detects when the last message in a conversation has a 'system' role and changes it to 'user'
- **Toggle Control**: Enable/disable the extension through the settings panel
- **Non-intrusive**: Works transparently with existing conversations
- **Logging**: Console logging for debugging and monitoring

## How It Works

The extension hooks into SillyTavern's Chat Completion API event system and intercepts outgoing requests. When a request is made:

1. The extension checks if the final message in the conversation has a 'system' role
2. If found, it changes the role from 'system' to 'user'
3. The modified request is then sent to the LLM

This ensures that GLM 4.5 (and similar models) will properly attend to system instructions that might otherwise be ignored when placed at the end of the conversation.

## Installation

1. Place this extension folder in your SillyTavern extensions directory
2. Restart SillyTavern or reload the page
3. The extension will automatically load and be available in the Extensions settings

## Configuration

The extension adds a settings panel in the Extensions section where you can:

- **Enable/Disable**: Toggle the extension on or off
- **View Status**: See when the extension is active and modifying messages

## Compatibility

- **SillyTavern**: Compatible with recent versions that support the Chat Completion API event system
- **Models**: Particularly useful for GLM 4.5, but can benefit other models that have similar behavior with system messages
- **APIs**: Works with any Chat Completion API endpoint

## Technical Details

- **Event Hook**: Uses `CHAT_COMPLETION_REQUESTED` event
- **Message Processing**: Creates a deep copy of messages to avoid modifying originals
- **Error Handling**: Includes try-catch blocks to prevent crashes
- **Settings Persistence**: Saves configuration to localStorage

## Troubleshooting

If the extension isn't working:

1. Check the browser console for error messages
2. Ensure SillyTavern is fully loaded before the extension initializes
3. Verify that the Chat Completion API is being used (not legacy endpoints)
4. Check that the extension is enabled in the settings

## Development

This extension follows SillyTavern's extension development patterns and uses:

- jQuery for DOM manipulation
- SillyTavern's event system for API interception
- localStorage for settings persistence
- Standard SillyTavern styling conventions

## Author

Created by envy-ai

## Version History

- **1.0.0**: Initial release with basic system-to-user role conversion functionality
