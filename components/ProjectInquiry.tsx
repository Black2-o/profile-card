"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface Props {
  projectTitle: string;
  telegram?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  twitter?: string | null;
}

export function ProjectInquiry({
  projectTitle,
  telegram,
  whatsapp,
  email,
  twitter,
}: Props) {
  const [showToast, setShowToast] = useState(false);
  const [mounted, setMounted] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const contactTelegram = telegram || "https://t.me/hishahidullah";
  const contactWhatsapp = whatsapp || null;
  const contactTwitter = twitter || null;
  const contactEmail = email || null;

  // Automatically dismiss after 6 seconds
  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => setShowToast(false), 6000);
    return () => clearTimeout(timer);
  }, [showToast]);

  // Dismiss on click outside
  useEffect(() => {
    if (!showToast) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (bannerRef.current && !bannerRef.current.contains(e.target as Node)) {
        setShowToast(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showToast]);

  return (
    <>
      {/* Simple, un-flashy text with underlined link */}
      <div className="project-inquiry-simple-wrap">
        <p className="project-inquiry-simple-text">
          Have a query or want to use this?{" "}
          <button
            type="button"
            className="project-inquiry-simple-link"
            onClick={() => setShowToast((prev) => !prev)}
            data-umami-event="click-project-inquiry"
            aria-label={`Message me about ${projectTitle}`}
          >
            Message me
          </button>
        </p>
      </div>

      {/* Rendered directly into <body> so it floats at the true top of the browser screen */}
      {mounted &&
        showToast &&
        createPortal(
          <div
            ref={bannerRef}
            className="top-inquiry-banner"
            role="status"
          >
            <div className="top-inquiry-content">
              <span className="top-inquiry-msg">
                Message me about <strong>{projectTitle}</strong>:
              </span>
              <div className="top-inquiry-icons">
                {contactTelegram && (
                  <a
                    href={contactTelegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="top-inquiry-icon telegram"
                    data-tooltip="Telegram"
                    data-umami-event="inquiry-click-telegram"
                    aria-label="Telegram"
                    onClick={() => setShowToast(false)}
                  >
                    <i className="fab fa-telegram"></i>
                  </a>
                )}

                {contactWhatsapp && (
                  <a
                    href={contactWhatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="top-inquiry-icon whatsapp"
                    data-tooltip="WhatsApp"
                    data-umami-event="inquiry-click-whatsapp"
                    aria-label="WhatsApp"
                    onClick={() => setShowToast(false)}
                  >
                    <i className="fab fa-whatsapp"></i>
                  </a>
                )}

                {contactTwitter && (
                  <a
                    href={contactTwitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="top-inquiry-icon twitter"
                    data-tooltip="X"
                    data-umami-event="inquiry-click-twitter"
                    aria-label="X (Twitter)"
                    onClick={() => setShowToast(false)}
                  >
                    <i className="fab fa-x-twitter"></i>
                  </a>
                )}

                {contactEmail && (
                  <a
                    href={
                      contactEmail.startsWith("mailto:")
                        ? contactEmail
                        : `mailto:${contactEmail}`
                    }
                    className="top-inquiry-icon email"
                    data-tooltip="Email"
                    data-umami-event="inquiry-click-email"
                    aria-label="Email"
                    onClick={() => setShowToast(false)}
                  >
                    <i className="fa-solid fa-envelope"></i>
                  </a>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
