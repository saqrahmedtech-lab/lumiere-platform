import { login } from "@/utils/supabase/actions/login";
import { DictionaryLocale, getDictionary } from "@/app/[locale]/dictionaries";
import { LoginButton } from "../../(admin)/components/loginButton";

async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as DictionaryLocale);
  const auth = dict.auth;
  const searchParams_ = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand px-4">
      <div className="w-full max-w-sm rounded-2xl border border-drift/30 bg-pearl p-8">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-2xl font-bold text-tide">
            Lumière<span className="text-bloom">.</span>
          </h1>
          <p className="mt-2 text-sm text-deep/60">{auth.loginHeading}</p>
        </div>

        {searchParams_.error === "invalid_credentials" && (
          <div className="mb-4 rounded-lg border border-bloom/30 bg-bloom/10 px-4 py-3 text-sm text-bloom">
            {auth.invalidCredentials}
          </div>
        )}
        {searchParams_.error === "not_authorized" && (
          <div className="mb-4 rounded-lg border border-bloom/30 bg-bloom/10 px-4 py-3 text-sm text-bloom">
            {auth.notAuthorized}
          </div>
        )}

        <form action={login} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-deep"
            >
              {auth.email}
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder={auth.emailPlaceholder}
              required
              className="w-full rounded-lg border border-drift bg-sand/40 px-3.5 py-2.5 text-sm text-deep outline-none transition-colors placeholder:text-deep/40 focus:border-tide focus:ring-2 focus:ring-tide/20"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-deep"
            >
              {auth.password}
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder={auth.passwordPlaceholder}
              required
              className="w-full rounded-lg border border-drift bg-sand/40 px-3.5 py-2.5 text-sm text-deep outline-none transition-colors placeholder:text-deep/40 focus:border-tide focus:ring-2 focus:ring-tide/20"
            />
          </div>

          <LoginButton
            loginText={auth.loginButton}
            loggingInText={auth.loggingIn}
          />
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
