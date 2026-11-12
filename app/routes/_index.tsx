import { Button, Spinner } from "@heroui/react";
import type { LoaderFunctionArgs } from "react-router";
import { data, useFetcher, useLoaderData } from "react-router";
import { createClient } from "~/libs/supabase.server";

export function meta() {
  return [{ title: "Hello World!" }];
}
export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase, headers } = createClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: userData } = await supabase
    .from("user")
    .select()
    .eq("id", String(user?.id))
    .single();

  return data(userData, { headers });
}
export default function Page() {
  const user = useLoaderData<typeof loader>();
  const { Form, state } = useFetcher();
  return (
    <main className="min-h-screen flex items-center justify-center">
      {user ? (
        <section className="flex flex-col gap-2">
          <div className="w-40">
            <img
              src={user.avatar_url}
              alt={user.email}
              className="w-full h-full"
            />
          </div>
          <div>
            <h4 className="font-semibold">{user.name}</h4>
            <p>{user.username}</p>
          </div>
          <Form method="POST" action="/auth/logout">
            <Button
              className={`w-full`}
              type="submit"
              size="sm"
              variant="danger"
              isDisabled={state === "submitting"}
            >
              {state === "submitting" ? <Spinner color="current" /> : null}{" "}
              Logout
            </Button>
          </Form>
        </section>
      ) : (
        <section>
          <h3 className="font-bold text-3xl">Hello!</h3>
          <Button>World!</Button>
        </section>
      )}
    </main>
  );
}
