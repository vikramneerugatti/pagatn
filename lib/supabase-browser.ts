import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Check if we are running during the build stage (server-side)
  // or if the environment keys are missing
  if (
    typeof window === 'undefined' || 
    !process.env.NEXT_PUBLIC_SUPABASE_URL || 
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    // Return a dummy placeholder client so Next.js doesn't crash during build
    return {} as any; 
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
