import {
  Button,
  FieldError,
  Input,
  Label,
  Spinner,
  Surface,
  TextField,
} from "@heroui/react";
import {
  Link,
  redirect,
  useFetcher,
  type ActionFunctionArgs,
} from "react-router";
import { createClient } from "~/libs/supabase.server";

export function meta() {
  return [{ title: "Login" }];
}

interface LoginData {
  email: string;
  password: string;
}
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const loginData = Object.fromEntries(formData) as unknown as LoginData;

  const { supabase, headers } = createClient(request);

  const { error: loginError } = await supabase.auth.signInWithPassword({
    email: loginData.email,
    password: loginData.password,
  });

  if (loginError) return console.log(loginError.message);

  return redirect("/", { headers });
}

export default function Page() {
  const { Form, state } = useFetcher();
  const isLoading = state === "submitting";
  return (
    <main>
      <section>
        <h1 className="font-bold text-2xl">Login</h1>
        <p className="text-white/50">Lorem ipsum dolor sit amet.</p>
      </section>
      <Surface className="p-5 rounded-lg my-5">
        <Form method="POST">
          <fieldset disabled={isLoading} className="flex flex-col gap-2">
            <TextField
              isRequired
              name="email"
              type="email"
              validate={(value) => {
                if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                  return "Please enter a valid email address";
                }
                return null;
              }}
            >
              <Label>Email</Label>
              <Input placeholder="johan@liebert.me" variant="secondary" />
              <FieldError />
            </TextField>

            <TextField
              isRequired
              name="password"
              type="password"
              validate={(value) => {
                if (value.length < 6)
                  return "Password must be at least 6 chars!";
                return null;
              }}
            >
              <Label>Password</Label>
              <Input placeholder="******" variant="secondary" />
              <FieldError />
            </TextField>

            <Button type="submit" className={`w-full`}>
              {isLoading ? <Spinner color="current" /> : null}
              Login
            </Button>
          </fieldset>
        </Form>
      </Surface>
      <section>
        <Link
          to={"/auth/register"}
          className="text-white/50 hover:text-white/75"
        >
          doesn't have account yet ? Register here
        </Link>
      </section>
    </main>
  );
}
