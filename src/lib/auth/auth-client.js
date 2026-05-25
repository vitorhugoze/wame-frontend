import { PUBLIC_FRONTEND_URL } from "$env/static/public"
import { createAuthClient } from "better-auth/svelte"

export const {signIn, signUp, useSession, getSession, listSessions, revokeSessions, resetPassword, requestPasswordReset } = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: PUBLIC_FRONTEND_URL
})