import fetch from 'node-fetch'; // Pokud používáš Node.js <18
import { env } from '$env/dynamic/private'; // Načítá API klíč

export async function sendVerificationEmail(email, verificationLink) {
    try {
        console.log('API klíč:', env.RESEND_API_KEY);
        console.log('Původní email příjemce:', email);

        // Testovací email
        const testEmail = 'vojtechvaclav86@gmail.com';

        console.log('Odesílám email na testovací adresu:', testEmail);

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'delivered@resend.dev', // Testovací odesílatel
                to: testEmail, // Posíláme na testovací adresu
                subject: 'Ověření vašeho emailu (Testovací režim)',
                html: `<p>Klikněte na následující odkaz pro ověření:</p>
                       <a href="${verificationLink}">Ověřit email</a>`,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Chyba při Resend API:', error);
            throw new Error(`Nepodařilo se odeslat email: ${error.message}`);
        }

        const data = await response.json();
        console.log('Email byl úspěšně odeslán na testovací adresu:', data);
        return data;
    } catch (error) {
        console.error('Chyba při odesílání emailu:', error);
        throw error;
    }
}
