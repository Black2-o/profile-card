"use client";

import { useState } from "react";

export function EmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const handleEmailClick = (e: React.MouseEvent) => {
    const rawEmail = email.replace(/^mailto:/, "").trim();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(rawEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <a
      className={`icon email ${copied ? "copied" : ""}`}
      href={email.startsWith("mailto:") ? email : `mailto:${email}`}
      onClick={handleEmailClick}
      data-tooltip={copied ? "Copied!" : "Email"}
      aria-label="Email"
    >
      <i className={copied ? "fa-solid fa-check" : "fa-solid fa-envelope"}></i>
    </a>
  );
}
