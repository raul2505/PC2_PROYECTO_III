"use client";

import { useActionState } from "react";
import { signIn, signOut } from "./actions";

export function LoginForm() {
  const [error, action, pending] = useActionState(signIn, null);

  return (
    <form className="auth-form" action={action}>
      <div className="auth-field">
        <label htmlFor="login-email">Correo electrónico</label>
        <input id="login-email" name="email" type="email" autoComplete="email" maxLength={254} required />
      </div>
      <div className="auth-field">
        <label htmlFor="login-password">Contraseña</label>
        <input id="login-password" name="password" type="password" autoComplete="current-password" maxLength={1024} required />
      </div>
      {error && <p className="auth-error" role="alert">{error}</p>}
      <button className="auth-button" type="submit" disabled={pending}>
        {pending ? "Iniciando sesión…" : "Iniciar sesión"}
      </button>
    </form>
  );
}

export function SignOutForm() {
  const [error, action, pending] = useActionState(signOut, null);

  return (
    <form className="auth-form" action={action}>
      {error && <p className="auth-error" role="alert">{error}</p>}
      <button className="auth-button" type="submit" disabled={pending}>
        {pending ? "Cerrando sesión…" : "Cerrar sesión"}
      </button>
    </form>
  );
}
