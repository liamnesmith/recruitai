import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = "https://jumwgliqvhkpakeyuiwj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_wYihEY0QCynlzah8TqH8lg_lOBbjPdw";

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
}
