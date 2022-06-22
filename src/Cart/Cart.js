import React from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Image,
    ImageBackground,
    TouchableOpacity,
    Alert,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import AppComponent from '../AppComponent';
import LoaderScreen from '../Components/LoaderScreen';
import AppHeader from '../Components/AppHeader';

import BodyStyle from '../BodyStyle';
import CartStyle from './Styles/CartStyle';
import {ScrollView} from "react-navigation";
import AppHeaderStyle from "../Components/Styles/AppHeaderStyle";
import ProductListStyle from "../ProductList/Styles/ProductListStyle";

const GLOBALS = require('../settings/Globals');
const API_URIs = require('../settings/API_URIs');

export default class Cart extends AppComponent {
    state = {
        cart: {
            itemsCount: 0,
            cartProducts: [],
        },
        totalPrice: 0,
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {
            this._retrieveData();
        });
    }

    componentWillUnmount() {
        this.focusListener.remove();
    }

    _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('@cart');
            let cart = JSON.parse(value);

            if (cart !== null) {
                let totalPrice = 0;
                cart.cartProducts.forEach((item) =>{
                     totalPrice += item.price * item.quantity;
                });
                this.setState({
                    cart: {
                        itemsCount: cart.cartProducts.length,
                        cartProducts: cart.cartProducts,
                    },
                    totalPrice: totalPrice,
                });
                if(this.state.totalPrice != 0){
                    await AsyncStorage.setItem('@totalPrice', JSON.stringify(this.state.totalPrice));
                }
            }
        } catch (error) {
            Alert.alert(
                'Error',
                'Cannot get data.',
                [
                    {text: 'OK'},
                ],
                {cancelable: false},
            );
        }
    };

    removeCartItem = async index => {
        try{
            let cart = this.state.cart.cartProducts;
            cart.splice(index, 1);
            let totalPrice = 0;
            this.state.cart.cartProducts.forEach((item) =>{
                totalPrice += item.price * item.quantity;
            });
            let cartNew = {
                itemsCount: cart.length,
                cartProducts: cart,
            };
            this.setState({
                cart: cartNew,
                totalPrice: totalPrice,
            })
            await AsyncStorage.setItem('@cart', JSON.stringify(cartNew));
        }
        catch(error){
            Alert.alert(
                'Error',
                'Cannot delete item.',
                [
                    {text: 'OK'},
                ],
                {cancelable: false},
            );
        }

    };

    cartItems = () =>{
        let cartItems = [];

        this.state.cart.cartProducts.forEach((item, index) => {
            cartItems.push(
                <View style={CartStyle.itemContainer}>
                    <View style={CartStyle.itemInfo}>
                        <Text style={CartStyle.itemTextPrice}>{item.quantity} x ${item.price}</Text>
                    </View>
                    <View style={CartStyle.itemTitle}>
                        <Text style={CartStyle.itemText} numberOfLines={1}>{item.title}</Text>
                    </View>
                    <View style={CartStyle.itemDelete}>
                        <TouchableOpacity style={CartStyle.itemDeleteButton} onPress={() => this.removeCartItem(index)}>
                            <View>
                                <Image source={require('../../assets/dash.png')} style={CartStyle.itemDeleteImage}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        });
        return cartItems;
    };

    renderPage = () => {
        let Content;

        if(this.state.cart.cartProducts.length === 0){
            Content = (
                <View style={[CartStyle.pageContent,{paddingHorizontal:20, alignItems:'center',justifyContent:'center'}]}>
                    <Text style={[CartStyle.emptyPageText,{marginBottom: 15, fontSize: 24}]}>Cart is empty</Text>
                    <Text style={CartStyle.emptyPageText}>Add items to make an order.</Text>
                </View>
            );
        }
        else{
            Content = (
                <View style={{flex:1,}}>
                    <View style={CartStyle.pageContent}>
                        <ScrollView>
                            <View style={CartStyle.container}>
                                {this.cartItems()}
                            </View>
                        </ScrollView>
                    </View>
                    <SafeAreaView  style={CartStyle.bottomSafeAreaView}>
                        <View style={{marginHorizontal: 20,}}>
                            <View style={CartStyle.totalPrice}>
                                <Text style={CartStyle.totalPriceText}>Total Price:</Text>
                                <Text style={CartStyle.totalPriceText}>${this.state.totalPrice}</Text>
                            </View>
                            <TouchableOpacity style={CartStyle.cartButton} onPress={()=> this.pressNext() }>
                                <Text style={CartStyle.cartButtonText}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </View>
            );
        }

        //if (this.state.loading === false && this.state.cart.cartProducts.length != 0) {
            return Content;
        // }
        // else {
        //     return <LoaderScreen text="Loading..."/>;
        // }
    };

    pressNext = () => {
        if(this.state.totalPrice < 20){
            Alert.alert(
                'Warning',
                'Your order price has to be not less than $20.',
                [
                    {text: 'OK'},
                ],
                {cancelable: false},
            );
        } else{
            this.props.navigation.navigate('CheckoutScreen')
        }
    };

    render(){
        return(
            <View style={[BodyStyle.pageLayout,{backgroundColor: '#fff'}]}>
                <View style={CartStyle.headerWrapper}>
                    <TouchableOpacity style={CartStyle.goBackIcon} onPress={() => {this.props.navigation.goBack()}}>
                        <Image source={require('../../assets/back.png')} style={{width: 20, height: 20, resizeMode: 'cover'}} />
                    </TouchableOpacity>
                    <View style={CartStyle.cartTitleWrapper}>
                        <Text style={CartStyle.cartTitleText}>Cart</Text>
                    </View>
                </View>
                {this.renderPage()}
            </View>
        );
    }
}
