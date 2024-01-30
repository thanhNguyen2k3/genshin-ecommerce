import nodemailer from 'nodemailer';

export const noderMail = async ({ to, html }: { to: string; html: string }) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.NODEMAILER_USER!, // generated ethereal user
            pass: process.env.NODEMAILER_PASS!,
        },
    });

    await transporter.sendMail({
        from: process.env.NODEMAILER_USER!, // sender address
        to, // list of receivers
        subject: 'Shop Genshin Global thông báo', // Subject line
        text: 'Shop Genshin Global', // plain text body
        html,
        replyTo: process.env.NODEMAILER_USER!,
    });
};
