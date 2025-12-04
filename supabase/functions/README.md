# Supabase Edge Functions

This directory contains Supabase Edge Functions for the Formula 1 Racing API.

## Keep Alive Function

The `keep-alive` edge function is designed to ping the main API endpoint to prevent it from sleeping due to inactivity on free-tier hosting platforms.

### How it Works

1. The GitHub Actions workflow triggers this edge function every 4 days
2. The edge function makes an HTTP GET request to the main API endpoint
3. This activity prevents the service from going to sleep

### Deployment

To deploy this edge function to Supabase:

1. Install the Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link to your project:
```bash
supabase link --project-ref your-project-ref
```

4. Deploy the function:
```bash
supabase functions deploy keep-alive
```

5. Set the required environment variable:
```bash
supabase secrets set API_URL=https://comp4513assignment1.adhillon.net
```

### Environment Variables

The edge function requires the following environment variable:

- `API_URL`: The URL of the main API to ping (defaults to `https://comp4513assignment1.adhillon.net`)

### Testing Locally

You can test the edge function locally using the Supabase CLI:

```bash
supabase functions serve keep-alive --env-file .env
```

Then make a request:
```bash
curl -i --location --request GET 'http://localhost:54321/functions/v1/keep-alive' \
  --header 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY'
```

### GitHub Secrets Required

The GitHub Actions workflow requires the following secrets:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase anon/public key (for calling edge functions)
- `API_URL`: The main API URL to keep alive (optional, defaults to the production URL)

### Workflow Schedule

The workflow runs every 4 days at midnight UTC (`0 0 */4 * *`) to ensure the API stays active.
