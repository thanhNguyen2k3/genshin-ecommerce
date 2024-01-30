import Link, { LinkProps } from 'next/link';
import { ReactNode } from 'react';
import { Button, ButtonProps } from 'antd';
import styled from 'styled-components';

type Props = ButtonProps & {
    addStyle?: string;
    onClick?: () => void;
    link?: string;
    disabled?: boolean;
    to?: string;
    children?: ReactNode;
};

const StyleButton = styled(Button)`
    background-color: #6eb89f;
    width: 100%;
    height: 100%;
    padding: 12px 0;
    display: flex;
    height: auto;
    text-transform: uppercase;
    font-weight: 500;
    color: #fff;
    border-radius: 1px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
        background-color: #5e8e74;
        color: white !important;
        cursor: pointer;
        border-color: currentColor !important;
    }

    &:disabled {
        background-color: #ccc !important;
        pointer-events: none;
    }

    &:active {
        border-color: currentColor;
    }
`;

const StyleButtonLink = styled(Link)`
    background-color: #6eb89f;
    text-align: center;
    padding: 10px 6px;
    width: 100%;
    display: block;
    text-transform: uppercase;
    font-weight: 400;
    color: #fff;
    border-radius: 1px;
    &:hover {
        background-color: #5e8e74;
        color: white !important;
    }
`;

const ButtonComponent = ({ addStyle, onClick, children, ...props }: Props) => {
    return (
        <>
            {props.to ? (
                <StyleButtonLink {...props} href={props.to}>
                    {children}
                </StyleButtonLink>
            ) : (
                <StyleButton {...props} onClick={onClick}>
                    {children}
                </StyleButton>
            )}
        </>
    );
};

export default ButtonComponent;
