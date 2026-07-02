import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// ReturnType<typeof createBrowserClient> resolves to `any` because
// createBrowserClient is an overloaded generic function — inferring the
// singleton's type from a real (non-overloaded) call keeps it concrete.
function newBrowserClient() {
  return createBrowserClient(supabaseUrl!, supabaseKey!);
}

let client: ReturnType<typeof newBrowserClient> | undefined;

// Returns a single shared browser client instance instead of a fresh one
// per call — multiple GoTrueClient/Realtime socket instances on the same
// page fight over auth state and can leave Realtime channels unauthorized.
export function createClient() {
  if (!client) {
    client = newBrowserClient();
  }
  return client;
}
