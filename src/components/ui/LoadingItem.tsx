'use client';

import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';

type Props = {};

const StyleSekeleton = styled(Skeleton)`
    .ant-skeleton-content {
        background: #000;
    }
`;

const LoadingItem = ({}: Props) => {
    return (
        <>
            <StyleSekeleton count={5} />
            <Skeleton />
        </>
    );
};

export default LoadingItem;
