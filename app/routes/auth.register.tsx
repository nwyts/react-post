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
  return [{ title: "Register" }];
}

interface RegisterData {
  name: string;
  username: string;
  email: string;
  password: string;
}
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const registerData = Object.fromEntries(formData) as unknown as RegisterData;

  const { supabase, headers } = createClient(request);

  const { data: usernameExist, error: usernameError } = await supabase
    .from("user")
    .select("username")
    .eq("username", registerData.username)
    .single();

  if (!usernameError && usernameExist)
    return console.log("Username already in used!");

  const { data: emailExist, error: emailError } = await supabase
    .from("user")
    .select("email")
    .eq("email", registerData.email)
    .single();

  if (!emailError && emailExist)
    return console.log("Email already registered!");

  const { error: registerError } = await supabase.auth.signUp({
    email: registerData.email,
    password: registerData.password,
  });

  if (registerError) return console.log(registerError.message);

  const { error: saveToDbError } = await supabase.from("user").insert({
    name: registerData.name,
    username: registerData.username,
    email: registerData.email,
    avatar_url: `https://ui-avatars.com/api/?name=${registerData.username}`,
  });

  if (saveToDbError) return console.log(saveToDbError.message);

  return redirect("/", { headers });
}

export default function Page() {
  const { Form, state } = useFetcher();
  const isLoading = state === "submitting";

  return (
    <main>
      <section>
        <h1 className="font-bold text-2xl">Register</h1>
        <p className="text-white/50">Lorem ipsum dolor sit amet.</p>
      </section>
      <Surface className="p-5 rounded-lg my-5">
        <Form method="POST">
          <fieldset className="flex flex-col gap-2" disabled={isLoading}>
            <TextField
              isRequired
              name="name"
              validate={(value) => {
                if (value.length < 1) return "Please enter your name!";
                return null;
              }}
            >
              <Label>Name</Label>
              <Input placeholder="Johan Liebert" variant="secondary" />
              <FieldError />
            </TextField>

            <TextField
              isRequired
              name="username"
              validate={(value) => {
                if (value.length < 1) return "Please enter your username!";
                return null;
              }}
            >
              <Label>Username</Label>
              <Input placeholder="JLiebert" variant="secondary" />
              <FieldError />
            </TextField>

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
              Register
            </Button>
          </fieldset>
        </Form>
      </Surface>
      <section>
        <Link to={"/auth/login"} className="text-white/50 hover:text-white/75">
          already have account ? Login here
        </Link>
      </section>
    </main>
  );
}
