import productApi from '@/services/product';
import { cartReducer } from '@/slices/cart';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';

import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['cart'],
};
const rootReducer = combineReducers({
    cart: cartReducer,
    [productApi.reducerPath]: productApi.reducer,
});

// Middleware
const middleware: any[] = [productApi.middleware];

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(...middleware),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default persistStore(store);
