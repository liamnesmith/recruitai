import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const SUPABASE_URL = "https://jumwgliqvhkpakeyuiwj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_wYihEY0QCynlzah8TqH8lg_lOBbjPdw";

export async function createClient() {
  const store = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return store.getAll();
      },
      setAll(items) {
        try {
          items.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {}
      },
    },
  });
}
