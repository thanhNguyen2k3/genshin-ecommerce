import { LoadingOutlined, SearchOutlined, CloseOutlined } from '@ant-design/icons';
import { Drawer, Spin } from 'antd';
import { FormEvent, SyntheticEvent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import SearchItem from '../SearchItem';
import instance from '@/lib/axios';
import { useDebounce } from '@/hooks/useDebounce';
import { ExtandProduct } from '@/types/extend';
import { useRouter } from 'next/navigation';

const StyleDrawer = styled(Drawer)`
    .ant-drawer-body {
        position: relative;
    }
`;

const SearchMenu = () => {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [input, setInput] = useState<string>('');
    const [data, setData] = useState<ExtandProduct[]>([]);
    const [showData, setShowData] = useState(true);

    const debounce = useDebounce(input, 1000);

    const inputRef = useRef<HTMLInputElement | null>(null);
    const shouldLog = useRef(true);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
        setInput('');
    };

    const makeRequest = async () => {
        try {
            setLoading(true);

            if (input === '') {
                setData([]);
            } else {
                const res = await instance.get(`/api/pl/search?q=${encodeURIComponent(input)}`);
                setData(res.data);
            }
        } catch (error) {
            setLoading(true);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: SyntheticEvent) => {
        const target = e.target as HTMLInputElement;
        setInput(target.value);
    };

    const handleClear = () => {
        setInput('');
        setData([]);
        inputRef.current?.focus();
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        router.push(`/shop?q=${input}`);
        setOpen(false);
    };

    useEffect(() => {
        if (shouldLog.current) {
            shouldLog.current = false;
        } else {
            if (debounce?.length === 0) {
                setShowData(false);
                setData([]);
            } else {
                setShowData(true);
                makeRequest();
            }
        }
    }, [debounce]);

    return (
        <>
            <button onClick={showDrawer}>
                <SearchOutlined className="text-content text-xl" />
            </button>

            <StyleDrawer
                title={
                    <form onSubmit={handleSubmit} action={`/shop?q=${input}`}>
                        <div className="flex justify-center items-center">
                            <input
                                value={input}
                                ref={inputRef}
                                onChange={handleChange}
                                required
                                type="text"
                                className="outline-none px-4 text-2xl text-center py-4"
                                placeholder="TÌM KIẾM"
                            />

                            {input.length > 0 && (
                                <button type="button" onClick={handleClear}>
                                    <CloseOutlined />
                                </button>
                            )}
                        </div>
                    </form>
                }
                placement={'bottom'}
                closable={false}
                onClose={onClose}
                open={open}
            >
                {loading ? (
                    <div className="absolute left-0 right-0 bottom-0 flex justify-center items-center top-0">
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin className="text-nav" />} />
                    </div>
                ) : (
                    <div className="grid grid-cols-5 xl:grid-cols-7 gap-4">
                        {showData &&
                            data.length > 0 &&
                            data.map((product) => <SearchItem key={product.id} product={product} />)}
                    </div>
                )}
            </StyleDrawer>
        </>
    );
};

export default SearchMenu;
