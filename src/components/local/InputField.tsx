'use client';

import { Input, InputProps, Form, FormItemProps, InputRef, InputNumber } from 'antd';
import { ChangeEvent, MutableRefObject, ReactNode } from 'react';
import styled from 'styled-components';

type Props = InputProps &
    FormItemProps & {
        onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
        children?: ReactNode;
        isNumber?: boolean;
        innerRef?: MutableRefObject<InputRef | null>;
        textarea?: boolean;
        isPassword?: boolean;
        onPressEnter?: () => void;
    };

const StyleInput = styled(Input)`
    border: solid 2px #ddd;
    border-radius: 2px;
    padding: 10px;
    color: #545454;
    font-size: 16px;
    font-weight: 400;
    width: 100%;

    &:focus {
        border-color: #ccc;
        background-color: #eee;
    }

    &:hover {
        border-color: #ccc;
        background-color: #eee;
    }
`;

const StyleInputNumber = styled(InputNumber)`
    border: solid 2px #ddd;
    border-radius: 2px;
    padding: 6px 0;
    color: #545454;
    font-size: 16px;
    font-weight: 400;
    width: 100%;

    &:focus-within {
        border-color: #ccc;
    }

    &:hover {
        border-color: #ccc;
    }
`;

const StyleFormItem = styled(Form.Item)`
    margin-bottom: 12px;

    textarea {
        border: solid 2px #ddd;
        border-radius: 2px;
        color: #545454;
        font-size: 16px;
        font-weight: 400;

        &:focus {
            border-color: #ccc;
        }

        &:active {
            border-color: #ccc;
        }

        &:focus-within {
            border-color: #ccc;
        }
    }
`;

const StyleInputPassword = styled(Input.Password)`
    border: solid 2px #ddd;
    border-radius: 2px;
    padding: 10px;
    color: #545454;
    font-size: 16px;
    font-weight: 400;
    width: 100%;

    &:focus {
        border-color: #ccc;
        background-color: #eee;
    }

    &:focus-within {
        border-color: #ccc;
        background-color: #eee;
    }

    &:hover {
        border-color: #ccc;
        background-color: #eee;
    }
`;

const InputField = ({
    onChange,
    onPressEnter,
    isNumber,
    children,
    textarea,
    isPassword,
    innerRef,
    ...props
}: Props) => {
    return (
        <>
            {textarea ? (
                <StyleFormItem {...props}>
                    <StyleInput.TextArea />
                </StyleFormItem>
            ) : (
                <StyleFormItem {...props}>
                    {isNumber ? (
                        <StyleInputNumber min={0} type="number" />
                    ) : isPassword ? (
                        <StyleInputPassword ref={innerRef} {...props} onChange={onChange} onPressEnter={onPressEnter} />
                    ) : (
                        <StyleInput ref={innerRef} {...props} onChange={onChange} onPressEnter={onPressEnter} />
                    )}
                </StyleFormItem>
            )}
        </>
    );
};

export default InputField;
