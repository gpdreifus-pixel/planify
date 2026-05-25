import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '[supabase] Missing environment variables. ' +
    'Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to your .env file ' +
    '(local) or Vercel Environment Variables (production). ' +
    'The app will run in offline/local-only mode until they are set.'
  )
}

// Fall back to placeholder values so createClient never throws —
// all Supabase calls will simply return errors, which the app handles gracefully.
export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseKey ?? 'placeholder-key'
)
