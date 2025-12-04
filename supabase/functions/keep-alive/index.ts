// Supabase Edge Function to keep the Formula 1 API alive
// This function pings the main API endpoint to prevent it from sleeping

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the API URL from environment variable or use the default
    const apiUrl = Deno.env.get('API_URL') || 'https://comp4513.assignment1.adhillon.net';
    
    console.log(`Pinging API at: ${apiUrl}`);
    
    // Make a request to the API root endpoint to wake it up
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Supabase-Keep-Alive-Function',
      },
    });

    const responseText = await response.text();
    
    console.log(`API responded with status: ${response.status}`);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'API ping completed successfully',
        status: response.status,
        timestamp: new Date().toISOString(),
        apiUrl: apiUrl,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error pinging API:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
