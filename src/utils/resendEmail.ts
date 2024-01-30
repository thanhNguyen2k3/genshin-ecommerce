import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
export const resendEmail = async (to?: string, react?: JSX.Element) => {
    await resend.emails.send({
        from: `Shop Genshin Global Contact <onboarding@resend.dev>`,
        to: to!,
        subject: 'Hello World',
        reply_to: 'thanhntph21000@fpt.edu.vn',
        react: react!,
    });
};
