import {
    Category,
    Order,
    Product,
    User,
    Character,
    Region,
    Vision,
    Weapon,
    Variant,
    Color,
    Size,
    SizesOnProducts,
    ColorsOnProduct,
    OrderItem,
    Session,
} from '@prisma/client';

type ExtandVariants = Variant & {
    color?: Color;
    size?: Size;
};

type ExtandSizes = SizesOnProducts & {
    size: Size;
};

type ExtandColors = ColorsOnProduct & {
    color: Color;
};

type ExtandOrderItem = OrderItem & {
    product: ExtandProduct;
    variant: ExtandVariants;
};

export type ExtandProduct = Product & {
    category?: Category | null;
    variants: ExtandVariants[];
    groupCharacter?: {
        character: Character & {
            region: Region;
            weapon: Weapon;
            vision: Vision;
        };
    }[];
    sizes: ExtandSizes[];
    colors: ExtandColors[];
};

export type ExtandOrder = Order & {
    orderItems: ExtandOrderItem[];
    user?: User;
};

export type ExtandCharacter = Character & {
    region: Region;
    vision: Vision;
    weapon: Weapon;
};

export type ExtandUser = User & {
    sessions: Session[];
};
