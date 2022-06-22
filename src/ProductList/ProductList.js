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
import ProductListStyle from './Styles/ProductListStyle';
import {ScrollView} from "react-navigation";
import objToQueryString from '../functions/objToQueryString';

const GLOBALS = require('../settings/Globals');
const API_URIs = require('../settings/API_URIs');

export default class ProductList extends AppComponent {
    state = {
        allProducts: [],
        // categories: [
        //     {
        //         id: 1,
        //         text: 'Kids/Starters',
        //     },
        //     {
        //         id: 2,
        //         text: 'Pizza',
        //     },
        //     {
        //         id: 3,
        //         text: 'Pasta',
        //     },
        //     {
        //         id: 4,
        //         text: 'Salad',
        //     },
        //     {
        //         id: 5,
        //         text: 'Desserts',
        //     },
        //     {
        //         id: 6,
        //         text: 'Chicken',
        //     },
        //     {
        //         id: 7,
        //         text: 'Drinks',
        //     },
        // ],
        cart: {
            itemsCount: 0,
            cartProducts: [],
        },
        categoryId: 0,
        loading: true,
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {
            this.dataLoadingAsync();
            this._retrieveData();
        });
    }

    componentWillUnmount() {
        this.focusListener.remove();
    }

    dataLoadingAsync = async () => {
        this.setState({allProducts: []});
        let i = [3,2,1];
        const queryString = objToQueryString({
            APP_VERSION: GLOBALS.APP_VERSION,
        });

        //i.forEach((i) => {
            fetch(GLOBALS.API_HOST+'/wp-json/app/v2/products', {
            })
                .then(response => response.json())
                .then(responseJson => {
                    if(responseJson != null){
                        let allProducts = this.state.allProducts;
                        let products = responseJson;
                        products.forEach((item) => {
                            allProducts.push(
                                {
                                    productId: item.id,
                                    title: item.title,
                                    image: item.thumb.replace('https://id3400.thestagingdomain.com','http://wharfhotelpizza.com'),
                                    price: item.price,
                                    quantity: 1,
                                },
                            );
                        });
                        this.setState({
                            allProducts: allProducts,
                            loading: false,
                        });
                    } else{
                        Alert(responseJson.message);
                    }
                })
                .catch(error =>
                    Alert(error.message)
                );
        //});


    };

    _retrieveData = async () => {
        try {
            const newCartData = await AsyncStorage.getItem('@cart');
            let cartData = JSON.parse(newCartData);

            if (cartData !== null) {
                this.setState({
                    cart: cartData,
                });
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

    _storeData = async () => {
        try {
            await AsyncStorage.setItem('@cart', JSON.stringify(this.state.cart));
        } catch (error) {
            Alert.alert(
                'Error',
                'You cannot add item to your cart.',
                [
                    {text: 'OK'},
                    {text: 'Go to cart', onPress: () => this.props.navigation.navigate('Cart')},
                ],
                {cancelable: false},
            );
        }
    };

    setActiveCategory = (id) => {
        if(id === this.state.categoryId){
            this.setState({categoryId: 0});
        }
        else{
            this.setState({categoryId: id});
        }
    };

    quantityFunction = (action, productId, index) => {
        let getProduct = this.state.allProducts[index];

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

    addToCart = (index) => {
        let product = this.state.allProducts[index];
        let cartState = this.state.cart;
        cartState.itemsCount = 0;
        let cartIndex = cartState.cartProducts.findIndex((item)=>item.productId === product.productId);

        if(!(cartIndex < 0)) {
            product.quantity += cartState.cartProducts[cartIndex].quantity;
            cartState.cartProducts[cartIndex] = product;
        } else {
            cartState.cartProducts.push(product);
        }

        this.setState({
            cart: cartState,
        });
        this._storeData();
        this.props.navigation.navigate('Cart');
        let changeQuantity = this.state.allProducts;
        changeQuantity.forEach((item) => {
            item.quantity = 1;
        });
        this.setState({
            allProducts: changeQuantity,
        });
    }

    goToItemPage = async (id) => {
        try {
            await AsyncStorage.setItem('@itemId', JSON.stringify(id));
            this.props.navigation.navigate('SingleItem');
        } catch {
            Alert.alert(
                'Error',
                'Cannot  open item info.',
                [
                    {text: 'OK'},
                ],
                {cancelable: false},
            );
        }
    }

    orderedProducts = () => {
        let outputProducts = [];

        this.state.allProducts.forEach((item, index) => {
            if(item.categoryId === this.state.categoryId || this.state.categoryId === 0){
                outputProducts.push(
                    <View style={{marginBottom: 20,}}>
                        <TouchableOpacity onPress={() => this.goToItemPage(item.productId)}>
                            <Image source={{'uri' : item.image}} style={[ProductListStyle.imageProduct,{borderRadius:20}]} />
                        </TouchableOpacity>
                        <View>
                            <TouchableOpacity onPress={() => this.goToItemPage(item.productId)}>
                                <Text style={ProductListStyle.productTitle}>{item.title}</Text>
                            </TouchableOpacity>
                            <View style={ProductListStyle.featuresBlock}>
                                <View>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text>Quantity</Text>
                                        <TouchableOpacity
                                            onPress={()=>this.quantityFunction('minus', item.productId, index )}
                                            style={ProductListStyle.actionQuantityButton}>
                                            <Text style={ProductListStyle.quantityText}>-</Text>
                                        </TouchableOpacity>
                                        <Text style={ProductListStyle.quantityText}>{item.quantity}</Text>
                                        <TouchableOpacity
                                            onPress={()=>this.quantityFunction('plus', item.productId, index)}
                                            style={ProductListStyle.actionQuantityButton}>
                                            <Text style={ProductListStyle.quantityText}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={ProductListStyle.productPrice}>${item.price}</Text>
                                </View>
                                <TouchableOpacity style={ProductListStyle.addToCartButton} onPress={() => this.addToCart(index)}>
                                    <Text>Add to cart</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                );
            }
        });

        return outputProducts;
    }

    // categoryButtons = () => {
    //     let contentButtons = [];
    //
    //     this.state.categories.forEach((item) =>{
    //         contentButtons.push(
    //             <TouchableOpacity
    //                 style={item.id === this.state.categoryId ?
    //                     [ProductListStyle.categoryButton,ProductListStyle.categoryButtonActive]
    //                     : ProductListStyle.categoryButton}
    //                 onPress={()=>{this.setActiveCategory(item.id)}}>
    //                 <Text style={ProductListStyle.categoryText}>{item.text}</Text>
    //             </TouchableOpacity>
    //         );
    //     });
    //     return contentButtons;
    // }


    renderPage = () => {
        if (this.state.loading === false) {
            return(
                <View style={BodyStyle.pageContent}>
                    <ScrollView>
                        <View style={ProductListStyle.container}>
                            {/*<View style={ProductListStyle.categoryBlock}>*/}
                            {/*    {this.categoryButtons()}*/}
                            {/*</View>*/}
                            <View style={ProductListStyle.titleTextBlock}>
                                <Text style={ProductListStyle.titleText}>
                                    {this.state.categoryId === 0 ? 'Order online' : this.state.categories[this.state.categoryId-1].text}
                                </Text>
                            </View>
                            <View style={ProductListStyle.orderedProductsBlock}>
                                {this.orderedProducts()}
                            </View>
                        </View>
                    </ScrollView>
                </View>
            );
        } else {
            return <LoaderScreen text="Loading..."/>;
        }
    };

    render() {

        return (
            <View style={BodyStyle.pageLayout}>
                <AppHeader navigation={this.props.navigation} />
                {this.renderPage()}
                <SafeAreaView  style={ProductListStyle.bottomSafeAreaView} />
            </View>
        );
    }
}
