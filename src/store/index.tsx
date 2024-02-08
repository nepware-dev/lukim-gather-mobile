import {configureStore} from '@reduxjs/toolkit';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';

import {cacheStorage} from './storage';
import rootReducer from './rootReducer';

const persistConfig = {
    key: 'root',
    storage: cacheStorage,
    whitelist: ['auth', 'locale', 'form', 'info'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
    reducer: persistedReducer,
    devTools: __DEV__,
    middleware: (getDefaultMiddleware) => ([
        ...getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        })
    ]),
});
const persistor = persistStore(store);

export {store, persistor};
