import { login } from "@/utils/supabase/actions/login";

async function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div style={{ maxWidth: 360, margin: "80px auto" }}>
      <h1>Log in</h1>

      {searchParams.error === "invalid_credentials" && (
        <p style={{ color: "red" }}>Incorrect email or password.</p>
      )}
      {searchParams.error === "not_authorized" && (
        <p style={{ color: "red" }}>You don&apos;t have access to that area.</p>
      )}

      <form action={login}>
        <input type="email" name="email" placeholder="Email" required />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <button type="submit">Log in</button>
      </form>
    </div>
  );
}

export default LoginPage;
