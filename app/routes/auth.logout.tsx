import { redirect, type ActionFunctionArgs } from "react-router";
import { createClient } from "~/libs/supabase.server";

export async function loader() {
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const { supabase, headers } = createClient(request);

  await supabase.auth.signOut();

  return redirect("/auth/login", { headers });
}
