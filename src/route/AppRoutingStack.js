import {
    createStackNavigator,
    StackViewTransitionConfigs,
} from 'react-navigation-stack';
import { createSwitchNavigator } from 'react-navigation';

import ProductList from '../ProductList/ProductList';
import SingleItem from '../ProductList/SingleItem';
import Cart from '../Cart/Cart';
import Checkout from '../Cart/Checkout';
import SuccessOrder from '../Cart/SuccessOrder';

const AppStack = createStackNavigator(
    {
        ProductList: ProductList,
        SingleItem: SingleItem,
        Cart: Cart,
        CheckoutScreen: Checkout,
        SuccessOrder: SuccessOrder,
    },
    {
        transitionConfig: () => StackViewTransitionConfigs.NoAnimation,
    }
);

export default createSwitchNavigator(
    {
        App: AppStack,
    },
    {
        initialRouteName: 'App',
    }
);
