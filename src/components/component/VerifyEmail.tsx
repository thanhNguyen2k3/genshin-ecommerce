import {
    Body,
    Button,
    Container,
    Column,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';

interface VercelInviteUserEmailProps {
    username?: string;
    verifyLink?: string;
}

const baseUrl = process.env.NEXT_URL ? `${process.env.NEXT_URL}` : '';

export const VerifyEmail = ({ username, verifyLink }: VercelInviteUserEmailProps) => {
    const previewText = `Kính chào quý khách đến với Shop Genshin Global`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
                        <Section className="mt-[32px]">
                            <Img
                                src={`https://genshin.global/wp-content/uploads/2022/05/logo-genshin-impact-global.webp`}
                                alt="Vercel"
                                className="my-0 mx-auto"
                            />
                        </Section>
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Kính chào quý khách đến với <strong>Shop Genshin Global</strong>
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">Hello {username},</Text>

                        <Section>
                            <Row>
                                <Column align="right">
                                    <Img
                                        className="rounded-full"
                                        src={`https://static.wikia.nocookie.net/gensin-impact/images/2/21/Icon_Emoji_Paimon%27s_Paintings_01_Paimon_5.png/revision/latest/scale-to-width-down/250?cb=20210906043832`}
                                        width="64"
                                        height="64"
                                    />
                                </Column>
                                <Column align="center">
                                    <Img
                                        src={`https://react-email-demo-ijnnx5hul-resend.vercel.app/static/vercel-arrow.png`}
                                        width="12"
                                        height="9"
                                        alt="invited you to"
                                    />
                                </Column>
                                <Column align="left">
                                    <Img
                                        className="rounded-full"
                                        src={`https://assets.stickpng.com/images/585e4bf3cb11b227491c339a.png`}
                                        width="64"
                                        height="64"
                                    />
                                </Column>
                            </Row>
                        </Section>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                style={{ padding: '12px 20px' }}
                                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center"
                                href={verifyLink}
                            >
                                Verify Email
                            </Button>
                        </Section>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Truy cập website
                            <Link href={`${baseUrl}`} className="text-blue-600 no-underline">
                                {baseUrl}
                            </Link>
                        </Text>
                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            Lời mời này dành cho {username}. Lời mời này được gửi từ {new Date().toLocaleDateString()}.
                            Nếu bạn không mong đợi lời mời này, bạn có thể bỏ qua email này. Nếu bạn lo ngại về sự an
                            toàn của tài khoản của mình, vui lòng trả lời email này để liên hệ với chúng tôi.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default VerifyEmail;
