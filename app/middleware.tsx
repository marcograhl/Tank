/* 
Diese Datei wird vor jeder Server-Komponente und API-Route aufgerufen, sie ist nötig
um Cookies und Header für den Login-Status zu aktualisieren, da Cookies und Header nicht
in Server-Komponenten oder API-Routen manipuliert werden können.

https://supabase.com/docs/guides/auth/auth-helpers/nextjs-server-components#configure-middleware
*/
/* import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';
import type { Database } from '@/types/supabase';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareSupabaseClient<Database>({ req, res });
  await supabase.auth.getSession();
  return res;
}
 */
