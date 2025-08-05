/**
 * GLM 4.5 Helper Extension for SillyTavern
 * 
 * This extension modifies the Chat Completion API requests to change any 'system' role 
 * in the final message to 'user' role, ensuring GLM 4.5 pays attention to system instructions.
 * 
 * @author envy-ai
 * @version 1.0.0
 */
import { eventSource, event_types, main_api, stopGeneration } from '../../../../script.js';

(function() {
    'use strict';

    const extensionName = 'Extension-GLM-4.5-Helper';
    const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
    
    let isEnabled = true;
    
    /**
     * Modifies the messages array to change the last 'system' role to 'user'
     * @param {Array} messages - Array of message objects
     * @returns {Array} Modified messages array
     */
    function modifyLastSystemMessage(messages) {
        console.log('[GLM 4.5 Helper] modifyLastSystemMessage called with:', messages);
        
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            console.log('[GLM 4.5 Helper] No messages to process or invalid input');
            return messages;
        }
        
        console.log(`[GLM 4.5 Helper] Processing ${messages.length} messages`);
        
        // Find the last message
        const lastMessage = messages[messages.length - 1];
        console.log('[GLM 4.5 Helper] Last message:', lastMessage);
        
        // Check if the last message has 'system' role and change it to 'user'
        if (lastMessage && lastMessage.role === 'system') {
            console.log('[GLM 4.5 Helper] Last message has system role - changing to user role');
            console.log('[GLM 4.5 Helper] Original message content:', lastMessage.content);
            lastMessage.role = 'user';
            console.log('[GLM 4.5 Helper] Modified last message:', lastMessage);
        } else {
            console.log(`[GLM 4.5 Helper] Last message role is '${lastMessage?.role}' - no modification needed`);
        }
    }
    
    /**
     * Hook into the Chat Completion API request
     */
    function hookChatCompletionAPI() {
        // Use makeFirst to ensure our handler runs before other processing
        eventSource.makeFirst(event_types.CHAT_COMPLETION_PROMPT_READY, async (data) => {
            console.log('[GLM 4.5 Helper] CHAT_COMPLETION_PROMPT_READY event received:', data);
            
            if (!isEnabled) {
                console.log('[GLM 4.5 Helper] Extension disabled, skipping');
                return;
            }
            
            // Skip dry runs (test prompts)
            if (data.dryRun) {
                console.log('[GLM 4.5 Helper] Skipping dry run prompt');
                return;
            }
            
            try {
                if (data && data.chat) {
                    console.log('[GLM 4.5 Helper] Intercepting chat completion request');
                    modifyLastSystemMessage(data.chat);
                    console.log('[GLM 4.5 Helper] Modified chat data:', data.chat);
                } else {
                    console.log('[GLM 4.5 Helper] No chat data found in event:', data);
                }
            } catch (error) {
                console.error('[GLM 4.5 Helper] Error modifying messages:', error);
            }
        });
        
        console.log('[GLM 4.5 Helper] Successfully hooked into Chat Completion API');
    }
    
    /**
     * Create settings UI
     */
    function createSettingsUI() {
        const settingsHtml = `
            <div class="glm-helper-settings">
                <div class="inline-drawer">
                    <div class="inline-drawer-toggle inline-drawer-header">
                        <b>GLM 4.5 Helper Settings</b>
                        <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
                    </div>
                    <div class="inline-drawer-content">
                        <label class="checkbox_label" for="glm_helper_enabled">
                            <input type="checkbox" id="glm_helper_enabled" ${isEnabled ? 'checked' : ''}>
                            <span>Enable GLM 4.5 Helper</span>
                        </label>
                        <small class="notes">
                            When enabled, this extension will automatically change the role of the final message from 'system' to 'user' in chat completions, ensuring GLM 4.5 pays attention to OOC instructions. This is for using <a href='https://docs.z.ai/guides/llm/glm-4.5'>GLM 4.5</a> via OpenAI compatibable APIs in chat completion mode, such as via z.ai or openrouter.
                        </small>
                    </div>
                </div>
            </div>
        `;
        
        $('#extensions_settings2').append(settingsHtml);
        
        // Bind settings change event
        $('#glm_helper_enabled').on('change', function() {
            isEnabled = $(this).is(':checked');
            saveSettings();
            console.log(`[GLM 4.5 Helper] Extension ${isEnabled ? 'enabled' : 'disabled'}`);
        });
    }
    
    /**
     * Save settings to localStorage
     */
    function saveSettings() {
        const settings = {
            enabled: isEnabled
        };
        localStorage.setItem('glm_helper_settings', JSON.stringify(settings));
    }
    
    /**
     * Load settings from localStorage
     */
    function loadSettings() {
        try {
            const savedSettings = localStorage.getItem('glm_helper_settings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                isEnabled = settings.enabled !== undefined ? settings.enabled : true;
            }
        } catch (error) {
            console.error('[GLM 4.5 Helper] Error loading settings:', error);
            isEnabled = true; // Default to enabled
        }
    }
    
    /**
     * Initialize the extension
     */
    function init() {
        console.log('[GLM 4.5 Helper] Initializing extension...');
        
        // Load saved settings
        loadSettings();
        
        // Create settings UI
        createSettingsUI();
        
        // Hook into the API
        hookChatCompletionAPI();
        
        console.log('[GLM 4.5 Helper] Extension initialized successfully');
    }
    
    /**
     * Extension entry point
     */
    jQuery(async () => {
        // Wait for SillyTavern to be fully loaded
        if (typeof eventSource === 'undefined' || typeof event_types === 'undefined') {
            console.log('[GLM 4.5 Helper] Waiting for SillyTavern to load...');
            setTimeout(() => {
                jQuery(async () => {
                    init();
                });
            }, 1000);
        } else {
            init();
        }
    });
    
})();
