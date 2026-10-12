import React, {useState} from "react";
import {api} from "../api.js";
import {Field} from "../ui.jsx";

function AuthCard({title, sub, children, foot}) {
  return (
    <div className="auth">
      <div className="auth-card">
        <h1 className="title-l">{title}</h1>
        {sub ? <p className="dim">{sub}</p> : null}
        {children}
      </div>
      {foot ? <div className="auth-foot">{foot}</div> : null}
    </div>
  );
}

function useSubmit(fn) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  return {busy, error, submit};
}

export function Login({onAuthed}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {busy, error, submit} = useSubmit(async () => onAuthed(await api.login({email, password})));
  return (
    <AuthCard title="Log in" foot={<>New to PixelScript? <a href="#/signup">Create an account</a></>}>
      <form className="auth-form" onSubmit={submit}>
        <Field label="Email">
          <input id="login-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </Field>
        <Field label="Password">
          <input id="login-password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        {error ? <div className="form-error" role="alert">{error}</div> : null}
        <button className="btn primary big" disabled={busy}>{busy ? "Logging in…" : "Log in"}</button>
        <a className="small" href="#/forgot">Forgot your password?</a>
      </form>
      <div className="or"><span>or</span></div>
      <button className="btn big google" type="button" disabled title="Coming with the public launch">
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.2 14.6 2.2 12 2.2 6.7 2.2 2.4 6.6 2.4 12s4.3 9.8 9.6 9.8c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.6H12z" /></svg>
        Continue with Google
        <span className="soon mono">SOON</span>
      </button>
    </AuthCard>
  );
}

export function Signup({onAuthed}) {
  const [f, setF] = useState({name: "", email: "", password: ""});
  const [agree, setAgree] = useState(false);
  const {busy, error, submit} = useSubmit(async () => {
    if (!agree) throw new Error("Please accept the Terms and Privacy Policy to continue.");
    onAuthed(await api.signup(f));
  });
  const set = (k) => (e) => setF({...f, [k]: e.target.value});
  return (
    <AuthCard title="Start free" sub="30 free credits. No card needed." foot={<>Already have an account? <a href="#/login">Log in</a></>}>
      <form className="auth-form" onSubmit={submit}>
        <Field label="Your name">
          <input id="signup-name" autoComplete="name" value={f.name} onChange={set("name")} placeholder="Abhishek" />
        </Field>
        <Field label="Email">
          <input id="signup-email" type="email" autoComplete="email" required value={f.email} onChange={set("email")} placeholder="you@example.com" />
        </Field>
        <Field label="Password" hint="At least 8 characters.">
          <input id="signup-password" type="password" autoComplete="new-password" required minLength={8} value={f.password} onChange={set("password")} />
        </Field>
        <label className="check">
          <input id="signup-agree" type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <span>I agree to the <a href="#/legal/terms">Terms</a> and <a href="#/legal/privacy">Privacy Policy</a>.</span>
        </label>
        {error ? <div className="form-error" role="alert">{error}</div> : null}
        <button className="btn primary big" disabled={busy}>{busy ? "Creating account…" : "Create account"}</button>
      </form>
    </AuthCard>
  );
}

export function Forgot() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const {busy, error, submit} = useSubmit(async () => {
    await api.forgot(email);
    setSent(true);
  });
  return (
    <AuthCard title="Reset password" foot={<a href="#/login">Back to log in</a>}>
      {sent ? (
        <p className="ok-box">
          If an account exists for <b>{email}</b>, a reset link is on its way. While PixelScript runs on your own computer, the link appears in the terminal window running PixelScript.
        </p>
      ) : (
        <form className="auth-form" onSubmit={submit}>
          <Field label="Email">
            <input id="forgot-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </Field>
          {error ? <div className="form-error" role="alert">{error}</div> : null}
          <button className="btn primary big" disabled={busy}>Send reset link</button>
        </form>
      )}
    </AuthCard>
  );
}

export function Reset({token, onAuthed}) {
  const [password, setPassword] = useState("");
  const {busy, error, submit} = useSubmit(async () => onAuthed(await api.reset(token, password)));
  return (
    <AuthCard title="Choose a new password">
      <form className="auth-form" onSubmit={submit}>
        <Field label="New password" hint="At least 8 characters.">
          <input id="reset-password" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        {error ? <div className="form-error" role="alert">{error}</div> : null}
        <button className="btn primary big" disabled={busy || !token}>Save and log in</button>
        {!token ? <span className="field-hint bad">This link is missing its token. Ask for a new reset link.</span> : null}
      </form>
    </AuthCard>
  );
}
