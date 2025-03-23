import {
    Action,
    configureStore,
    ThunkAction,
} from '@reduxjs/toolkit';
import userReducer from './slice/userSlide';
import accountReducer from './slice/accountSlide';
import roleReducer from './slice/roleSlide';
import productReducer from './slice/productSlide'
import categoryReducer from './slice/categorySlide'
import colorReducer from './slice/colorSlide'
import sizeReducer from './slice/sizeSlide'

export const store = configureStore({
    reducer: {
        user: userReducer,
        account: accountReducer,
        role: roleReducer,
        product: productReducer,
        category: categoryReducer,
        color: colorReducer,
        size: sizeReducer,
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;