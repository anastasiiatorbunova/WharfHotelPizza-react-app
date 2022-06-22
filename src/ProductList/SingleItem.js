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
import {ScrollView} from "react-navigation";
import AppHeaderStyle from "../Components/Styles/AppHeaderStyle";
import CartStyle from "../Cart/Styles/CartStyle";
import SingleItemStyle from "../ProductList/Styles/SingleItemStyle";
import objToQueryString from "../functions/objToQueryString";
import ProductListStyle from "./Styles/ProductListStyle";

const GLOBALS = require('../settings/Globals');
const API_URIs = require('../settings/API_URIs');
const cart = [];

export default class SingleItem extends AppComponent {
    state = {
        productId: 0,
        title: '',
        description: '',
        image: '',
        price: '',
        loading: true,
        quantity: 1,
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

    dataLoadingAsync = async () => {
        let id = this.state.productId;

        fetch(GLOBALS.API_HOST+'/wp-json/app/v2/products', {
        })
            .then(response => response.json())
            .then(responseJson => {
                if(responseJson != null){
                    let allProducts = responseJson;
                    console.log(id);
                    allProducts.forEach((item) => {
                        if(item.id === id){
                            this.setState({
                                productId: item.id,
                                title: item.title,
                                description: item.description,
                                image: item.thumb.replace('https://id3400.thestagingdomain.com','http://wharfhotelpizza.com'),
                                price: item.price,
                                loading: false,
                            });
                        }
                    });

                } else{
                    Alert(responseJson.message);
                }
            })
            .catch(error =>
                Alert(error.message)
            );
    };

    _retrieveData = async () => {
        try {
            const itemId = await AsyncStorage.getItem('@itemId');
            let id = JSON.parse(itemId);

            const cartGet = await AsyncStorage.getItem('@cart');
            let cart = JSON.parse(cartGet);

            if (id != null && id!=0 ) {
                this.setState({productId: id});
                this.cart = cart;
                this.dataLoadingAsync();
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

    quantityFunction = (action) => {
        let getProduct = this.state;

        if(action === 'plus'){
            getProduct.quantity = Number(getProduct.quantity) + 1;
            this.setState({
                getProduct
            });
        }
        if(action === 'minus'){
            if(getProduct.quantity > 1){
                getProduct.quantity = Number(getProduct.quantity) - 1;
                this.setState({
                    getProduct
                });
            }
        }
    }

    addToCart = async () => {
        let product = this.state;
        let cart = this.cart;
        let cartIndex = cart.cartProducts.findIndex((item)=>item.productId === product.productId);

        if(!(cartIndex < 0)) {
            product.quantity += cart.cartProducts[cartIndex].quantity;
            cart.cartProducts[cartIndex] = product;
        } else {
            cart.cartProducts.push(product);
        }

        await AsyncStorage.setItem('@cart', JSON.stringify(cart));
        this.props.navigation.navigate('Cart');

        this.setState({
            quantity: 1,
        });
    }

    contentPage = () => {
        return (
            <View style={BodyStyle.pageLayout}>
                <View style={CartStyle.headerWrapper}>
                    <TouchableOpacity style={CartStyle.goBackIcon} onPress={() => {this.props.navigation.goBack()}}>
                        <Image source={require('../../assets/back.png')} style={{width: 20, height: 20, resizeMode: 'cover'}} />
                    </TouchableOpacity>
                    <View style={CartStyle.cartTitleWrapper}>
                        <Text style={CartStyle.cartTitleText}>{this.state.title}</Text>
                    </View>
                </View>
                <View style={[CartStyle.pageContent,{paddingHorizontal:20}]}>
                    <View style={SingleItemStyle.imageContainer}>
                        <Image source={{'uri' : this.state.image}} style={[ProductListStyle.imageProduct,{borderRadius:20,borderWidth:1,borderColor:'#f1f2f4'}]} />
                    </View>
                    <View style={SingleItemStyle.infoBlock}>
                        <Text style={SingleItemStyle.descriptionItem}>{this.state.description.replace(/<\/?[^>]+>/g,'')}</Text>
                    </View>
                    <View style={ProductListStyle.featuresBlock}>
                        <View>
                            <View style={{flexDirection: 'row'}}>
                                <Text>Quantity</Text>
                                <TouchableOpacity
                                    onPress={()=>this.quantityFunction('minus', this.state.productId )}
                                    style={ProductListStyle.actionQuantityButton}>
                                    <Text style={ProductListStyle.quantityText}>-</Text>
                                </TouchableOpacity>
                                <Text style={ProductListStyle.quantityText}>{this.state.quantity}</Text>
                                <TouchableOpacity
                                    onPress={()=>this.quantityFunction('plus', this.state.productId)}
                                    style={ProductListStyle.actionQuantityButton}>
                                    <Text style={ProductListStyle.quantityText}>+</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={ProductListStyle.productPrice}>${this.state.price}</Text>
                        </View>
                        <TouchableOpacity style={ProductListStyle.addToCartButton} onPress={() => this.addToCart()}>
                            <Text>Add to cart</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    renderPage = () => {
        if (this.state.loading === false) {
            return this.contentPage();
        } else {
            return <LoaderScreen text="Loading..."/>;
        }
    };

    render(){
        return (
            this.renderPage()
        );
    }
}
