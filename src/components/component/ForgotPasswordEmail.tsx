import { Body, Container, Head, Heading, Hr, Html, Link, Section, Text } from '@react-email/components';

interface LinearLoginCodeEmailProps {
    newPassword?: string;
}

const baseUrl = process.env.NEXT_URL ? `${process.env.NEXT_URL}` : '';

const ForgotPasswordEmail = ({ newPassword = 'tt226-5398x' }: LinearLoginCodeEmailProps) => (
    <Html>
        <Head />
        <Body style={main}>
            <Container style={container}>
                <Heading style={heading}>Mật khẩu mới.</Heading>
                <Section style={buttonContainer}></Section>
                <Text style={paragraph}>
                    Mật khẩu mới của bạn ở bên dưới.Vui lòng đổi mật khẩu dể bạn không bị quên nó.
                </Text>
                <code style={code}>{newPassword}</code>
                <Hr style={hr} />
                <Link href={baseUrl} style={reportLink}>
                    Shop genshin global
                </Link>
            </Container>
        </Body>
    </Html>
);

export default ForgotPasswordEmail;

const main = {
    backgroundColor: '#ffffff',
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    width: '560px',
};

const heading = {
    fontSize: '24px',
    letterSpacing: '-0.5px',
    lineHeight: '1.3',
    fontWeight: '400',
    color: '#484848',
    padding: '17px 0 0',
};

const paragraph = {
    margin: '0 0 15px',
    fontSize: '15px',
    lineHeight: '1.4',
    color: '#3c4149',
};

const buttonContainer = {
    padding: '27px 0 27px',
};

const reportLink = {
    fontSize: '14px',
    color: '#b4becc',
};

const hr = {
    borderColor: '#dfe1e4',
    margin: '42px 0 26px',
};

const code = {
    fontFamily: 'monospace',
    fontWeight: '700',
    padding: '1px 4px',
    backgroundColor: '#dfe1e4',
    letterSpacing: '-0.3px',
    fontSize: '21px',
    borderRadius: '4px',
    color: '#3c4149',
};
