import fetch from 'node-fetch';
import { SECRET_RESEND_API_KEY } from '$env/static/private';
import { BASE_URL } from '$env/static/private';

// Funkce pro odeslání verifikačního e-mailu
export async function sendVerificationEmail(to, nickname, token) {
    const subject = 'Verify Your Email';
    const verifyLink = `${BASE_URL}/verify?token=${token}`; // Dynamický link založený na BASE_URL
    const htmlContent = `Hello ${nickname},<br>Please verify your email by clicking on the following link: <a href="${verifyLink}">Verify Email</a>`;

    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SECRET_RESEND_API_KEY}`
        },
        body: JSON.stringify({
            from: 'notifications@xp-life.cz',
            to,
            subject,
            html: htmlContent
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error('Failed to send email: ' + errorText);
    }

    return response.json();
}

// Obecná funkce pro odeslání e-mailu
export async function sendEmail(to, subject, html) {
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SECRET_RESEND_API_KEY}`
        },
        body: JSON.stringify({
            from: 'delivered@resend.dev', // Testovací adresa pro odesílání e-mailů
            to,
            subject,
            html // Odesíláme HTML obsah
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to send email:', errorText);
        throw new Error('Failed to send email');
    }

    return response.json();
}