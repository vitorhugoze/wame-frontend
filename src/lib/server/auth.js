import { betterAuth } from 'better-auth';
import { MAIL_HOST, MAIL_PASS, MAIL_PORT, MAIL_USER } from '$env/static/private';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import nodemailer from 'nodemailer';
import { pool } from './db';

export const auth = betterAuth({
	database: pool,
	emailAndPassword: {
		enabled: true,
		sendResetPassword: async ({ user, url, token }, request) => {
			SendResetEmail(user.email, url);
		},
		onPasswordReset: async ({ user }, request) => {
			console.log(`Password for user ${user.email} has been reset.`);
		}
	},
	plugins: [sveltekitCookies(getRequestEvent)],
	session: {
		expiresIn: 60 * 60 * 24 * 7,
		updateAge: 60 * 60 * 24
	}
});

async function SendResetEmail(email, url) {
	const transporter = nodemailer.createTransport({
		host: MAIL_HOST,
		port: MAIL_PORT,
		secure: false,
		auth: {
			user: MAIL_USER,
			pass: MAIL_PASS
		}
	});

	const info = await transporter.sendMail({
		from: '"WAME Accounts" <accounts@wameapi.com>',
		to: email,
		subject: 'Password Reset Request',
		text: `You requested a password reset. Click the link below:\n\n${url}`,
		html: `<p>You requested a password reset.</p>
               <p><a href="${url}">Click here to reset your password</a></p>`
	});
}
