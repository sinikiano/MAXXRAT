// Supabase setup with enhanced configuration
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Enhanced Supabase client with connection pooling and error handling
export const supabase = createClient(
    window.supabaseConfig?.url || 'https://rlxqtqanykhengqrtbsg.supabase.co',
    window.supabaseConfig?.anonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJseHF0cWFueWtoZW5ncXJ0YnNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzQ2MTUsImV4cCI6MjA3MjY1MDYxNX0.AmVgHTmLm3C2L2wVvJ0DiM2lm5nkWBW9HVQdhrJwfkc',
    {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        },
        realtime: {
            params: {
                eventsPerSecond: 10
            }
        },
        db: {
            schema: 'public'
        },
        global: {
            headers: {
                'x-my-custom-header': 'MAXXRAT'
            }
        }
    }
);

// Connection health check
export async function checkConnection() {
    try {
        const { data, error } = await supabase
            .from('victims')
            .select('count', { count: 'exact', head: true });

        if (error) throw error;
        return { connected: true, latency: Date.now() };
    } catch (error) {
        console.error('Supabase connection error:', error);
        return { connected: false, error: error.message };
    }
}

// Initialize connection monitoring
window.addEventListener('load', async () => {
    const connectionStatus = await checkConnection();
    if (!connectionStatus.connected) {
        console.warn('Supabase connection failed:', connectionStatus.error);
        // You could show a connection error UI here
    }
});
