"use client";

import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";

import { BrandMark } from "@/components/brand/BrandMark";

import styles from "./SignedOutGate.module.css";

/**
 * SignedOutGate stands in for every dashboard page when nobody is signed in.
 * Without it a visitor who opens a dashboard link (a shared or bookmarked URL)
 * sees the page sit on "Loading…" forever, because every list needs a session.
 * They get a log in / sign up card instead, and come back to the same URL once
 * they are in. While Clerk is still loading the page renders as usual, so
 * signed-in users never see the card flash.
 */
export function SignedOutGate({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded || isSignedIn) return <>{children}</>;

  // Only reached in the browser (Clerk never reports loaded on the server).
  const returnTo = window.location.pathname + window.location.search + window.location.hash;

  return (
    <div className={styles.backdrop}>
      <div className={styles.card}>
        <Link href="/" className={`${styles.brand} notranslate`} aria-label="Wapzen home">
          <span className={styles.mark}><BrandMark priority /></span>
          Wapzen
        </Link>
        <h1 className={styles.title}>Log in to continue</h1>
        <p className={styles.body}>
          This page is part of the Wapzen dashboard. Log in, or create a free account, to open it.
        </p>
        <div className={styles.actions}>
          <SignInButton mode="modal" forceRedirectUrl={returnTo} signUpForceRedirectUrl={returnTo}>
            <button className={styles.primary} type="button">Log in</button>
          </SignInButton>
          <SignUpButton mode="modal" forceRedirectUrl={returnTo} signInForceRedirectUrl={returnTo}>
            <button className={styles.ghost} type="button">Sign up</button>
          </SignUpButton>
        </div>
      </div>
    </div>
  );
}
