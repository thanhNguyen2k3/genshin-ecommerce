import { ExtandProduct } from '@/types/extend';
import Link from 'next/link';

type Props = {
    product: ExtandProduct;
};

const SearchItem = ({ product }: Props) => {
    return (
        <Link href={`/single/${product?.category?.id}/${product.id}`}>
            <img src={`/uploads/${product.images[0]}`} alt={product.name} />
            <h2 className="text-sm font-semibold mt-2">{product.name}</h2>
        </Link>
    );
};

export default SearchItem;
