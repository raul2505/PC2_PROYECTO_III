"use client";

import { useActionState } from "react";
import { reviewReport } from "./actions";

export function ReviewForm({ id }: { id: string }) {
  const [error, action, pending] = useActionState(reviewReport, null);
  return (
    <form action={action} className="auth-form">
      <input type="hidden" name="report_id" value={id} />
      <div className="review-buttons">
        <button className="auth-button" type="submit" name="decision" value="approved" disabled={pending}>Aprobar</button>
        <button className="auth-secondary" type="submit" name="decision" value="rejected" disabled={pending}>Rechazar</button>
      </div>
      {error && <p className="auth-error" role="alert">{error}</p>}
    </form>
  );
}
