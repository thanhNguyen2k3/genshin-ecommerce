import { Divider, DividerProps } from 'antd';
import styled from 'styled-components';

type Props = DividerProps & {
    fading?: boolean;
};

const StyleDivider = styled(Divider)`
    background-color: #000;
    margin: 10px 0;
`;

const StyleDividerFading = styled(Divider)`
    background-color: #eee;
    margin: 10px 0;
`;

const DividerFading = ({ fading, ...props }: Props) => {
    return <>{fading ? <StyleDividerFading /> : <StyleDivider {...props} />}</>;
};

export default DividerFading;
