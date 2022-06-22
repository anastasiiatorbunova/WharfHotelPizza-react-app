import React from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Image,
    TouchableOpacity,
    Alert,
    Platform,
    Picker,
    TextInput,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppComponent from '../AppComponent';
import LoaderScreen from '../Components/LoaderScreen';
import AppHeader from '../Components/AppHeader';

import BodyStyle from '../BodyStyle';
import CheckoutStyle from './Styles/CheckoutStyle';
import {ScrollView} from "react-navigation";
import CartStyle from "./Styles/CartStyle";
import ProductListStyle from "../ProductList/Styles/ProductListStyle";
// import moment from 'moment';

const GLOBALS = require('../settings/Globals');
const API_URIs = require('../settings/API_URIs');

export default class CheckoutScreen extends AppComponent {
    state = {
        totalPrice: 0,
        enteredCoupon: '',
        loading: true,
        deliveryTime: '12.30 PM',
        orderComment: '',
        name: '',
        surname: '',
        streetAddress: '',
        phone: '',
        email: '',
        cart: {
            itemsCount: 0,
            cartProducts: [],
        },
        checkCoupon: false,
        couponDescription: '',
        amountDiscount: '',
        coupons: [],
        lastOrder: '',
        client: [],
        formattedOrder: [],
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {
            this.setState({
                loading: true,
            });
            this._retrieveData();
            this.dataLoadingAsync();
        });
    }

    componentWillUnmount() {
        this.focusListener.remove();
    }

    dataLoadingAsync = async() => {

        console.log( new Date().toLocaleString("en-US", {timeZone: "Australia/Tasmania"}) );

        //Get coupons
        fetch(GLOBALS.API_HOST+'/wp-json/app/v2/coupons', {
        })
            .then(response => response.json())
            .then(responseJson => {
                if(responseJson != null){
                    let allCoupons = responseJson;
                    this.setState({
                        coupons: allCoupons,
                        loading: false,
                    });
                } else{
                    Alert(responseJson.message);
                }
        })
            .catch(error =>
                Alert(error.message)
            );

        //Get last order
        fetch(GLOBALS.API_HOST+'/wp-json/app/v2/orders', {
        })
            .then(response => response.json())
            .then(responseJson => {
                if(responseJson != null){
                    let lastOrder = responseJson;
                    this.setState({
                        lastOrder: lastOrder,
                        loading: false,
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
            const value = await AsyncStorage.getItem('@totalPrice');
            let totalPrice = JSON.parse(value);

            const cartGet = await AsyncStorage.getItem('@cart');
            let cart = JSON.parse(cartGet);

            if (value !== null) {
                this.setState({
                    totalPrice: totalPrice,
                    loading: false,
                });
            }
            if(cart != null){
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

    makeOrder = async () => {
        if(this.state.name != '' && this.state.surname != '' && this.state.streetAddress != ''
        && this.state.phone != '' && this.state.email != '' ){
            try{
                if(this.state.enteredCoupon != ''){
                    let checkCoupon = 'false';
                    this.state.coupons.forEach((item) => {
                        if(item.code === this.state.enteredCoupon){
                            checkCoupon = 'true';
                        }
                    });
                    //console.log(checkCoupon);
                }
                await AsyncStorage.setItem('@cart', JSON.stringify(this.state.cart));

                let formattedOrder = [];
                this.state.cart.cartProducts.forEach((item) => {
                    formattedOrder.push(
                        {
                            'id': item.productId,
                            'quantity': item.quantity,
                        }
                    );
                });

                let client = [
                    {
                        'first_name': this.state.name,
                        'last_name': this.state.surname,
                        'email': this.state.email,
                        'phone': this.state.phone,
                        'address_1': this.state.streetAddress,
                        'city': 'Wynyard',
                        'postcode': '7325',
                        'country': 'Tasmania',
                        'note': this.state.orderComment,
                        'selected_time': this.state.deliveryTime,
                    },
                    {
                        'totalPrice': this.state.totalPrice,
                    },
                ];

                this.setState({formattedOrder: formattedOrder, client: client});
                this.sendOrder();

                let emptyCart = {
                    itemsCount: 0,
                    cartProducts: [],
                };
                await AsyncStorage.setItem('@cart', JSON.stringify(emptyCart));
            } catch (error) {
                Alert.alert(
                    'Error',
                    'Cannot get data.',
                    [
                        {text: 'OK'},
                    ],
                    {cancelable: false},
                );
            };
        }
        else{
            Alert.alert(
                'Warning',
                'Fill all required information.',
                {cancelable: false},
            );
        }
    };

    sendOrder = async() => {
        let formData = new FormData();
        formData.append('order', JSON.stringify(this.state.formattedOrder));
        formData.append('client', JSON.stringify(this.state.client));

        fetch(GLOBALS.API_HOST+'/wp-json/app/v2/orders', {
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then(response => response.json())
            .then(responseJson => {
                this.props.navigation.navigate('SuccessOrder');
            })
            .catch(err => {
                Alert(err.message);
            });
    };

    _scrollToInput (reactNode: any) {
        this.scroll.props.scrollToFocusedInput(reactNode);
    }
    validateCouponCode = () => {
        let message = '';
        if (this.state.checkCoupon === true){
            if (this.state.couponDescription != ''){
                message = this.state.couponDescription;
            } else {
                message = 'Your discount: ' + this.state.amountDiscount;
            }
        } else {
            if (this.state.enteredCoupon != ''){
                message = 'Invalid coupon code';
            } else {
                message = '';
            }
        }
        return message;
    }

    renderPage = () => {
        if (this.state.loading === false) {
            return(
                <View style={{flex:1,}}>
                    <KeyboardAwareScrollView
                        innerRef={ref => {
                            this.scroll = ref
                        }}>
                        <ScrollView style={CartStyle.pageContent}>
                            <View style={CartStyle.container}>
                                <View>
                                    <Text style={CartStyle.totalPriceText}>Select delivery time:</Text>
                                    <Picker
                                        selectedValue={this.state.deliveryTime}
                                        style={Platform.OS === 'ios' ? {height:230,width:'100%',} : {height:50,width:'100%',borderWidth:1,borderColor:'#e0e0e0',borderRadius:25}}
                                        onValueChange={(itemValue) =>
                                            this.setState({deliveryTime: itemValue})
                                        }>
                                        <Picker.Item label="12:15 PM" value="12:15 PM" />
                                        <Picker.Item label="12:30 PM" value="12:30 PM" />
                                        <Picker.Item label="12:45 PM" value="12:45 PM" />
                                        <Picker.Item label="1:00 PM" value="1:00 PM" />
                                        <Picker.Item label="1:15 PM" value="1:15 PM" />
                                        <Picker.Item label="1:30 PM" value="1:30 PM" />
                                        <Picker.Item label="1:45 PM" value="1:45 PM" />
                                        <Picker.Item label="2:00 PM" value="2:00 PM" />
                                        <Picker.Item label="6:00 PM" value="6:00 PM" />
                                        <Picker.Item label="6:15 PM" value="6:15 PM" />
                                        <Picker.Item label="6:30 PM" value="6:30 PM" />
                                        <Picker.Item label="6:45 PM" value="6:45 PM" />
                                        <Picker.Item label="7:00 PM" value="7:00 PM" />
                                        <Picker.Item label="7:15 PM" value="7:15 PM" />
                                        <Picker.Item label="7:30 PM" value="7:30 PM" />
                                        <Picker.Item label="7:45 PM" value="7:45 PM" />
                                        <Picker.Item label="8:00 PM" value="8:00 PM" />
                                    </Picker>
                                </View>
                                <View>
                                    <View style={{flexDirection:'row'}}>
                                        <Text style={[CheckoutStyle.textForInput,{marginTop:0}]}>Name</Text>
                                        <Text style={CheckoutStyle.requiredText}>*</Text>
                                    </View>
                                    <TextInput
                                        style={CheckoutStyle.inputStyle}
                                        onChangeText={(name) => this.setState({name: name})}
                                        value={this.state.name}
                                        onFocus={(event: Event) => {
                                            this._scrollToInput(event.target);
                                        }}
                                    />
                                    <View style={{flexDirection:'row'}}>
                                        <Text style={[CheckoutStyle.textForInput,{marginTop:0}]}>Surname</Text>
                                        <Text style={CheckoutStyle.requiredText}>*</Text>
                                    </View>
                                    <TextInput
                                        style={CheckoutStyle.inputStyle}
                                        onChangeText={(surname) => this.setState({surname: surname})}
                                        value={this.state.surname}
                                        onFocus={(event: Event) => {
                                            this._scrollToInput(event.target);
                                        }}
                                    />
                                    <View style={{flexDirection:'row'}}>
                                        <Text style={[CheckoutStyle.textForInput,{marginTop:0}]}>Street Address</Text>
                                        <Text style={CheckoutStyle.requiredText}>*</Text>
                                    </View>
                                    <TextInput
                                        style={CheckoutStyle.inputStyle}
                                        onChangeText={(streetAddress) => this.setState({streetAddress: streetAddress})}
                                        value={this.state.streetAddress}
                                        onFocus={(event: Event) => {
                                            this._scrollToInput(event.target);
                                        }}
                                    />
                                    <View style={{flexDirection:'row'}}>
                                        <Text style={[CheckoutStyle.textForInput,{marginTop:0}]}>Phone</Text>
                                        <Text style={CheckoutStyle.requiredText}>*</Text>
                                    </View>
                                    <TextInput
                                        style={CheckoutStyle.inputStyle}
                                        onChangeText={(phone) => {

                                            this.setState({phone: phone.replace(/[^\d]/g,'') });
                                        }}
                                        value={this.state.phone}
                                        onFocus={(event: Event) => {
                                            this._scrollToInput(event.target);
                                        }}
                                    />
                                    <View style={{flexDirection:'row'}}>
                                        <Text style={[CheckoutStyle.textForInput,{marginTop:0}]}>Email</Text>
                                        <Text style={CheckoutStyle.requiredText}>*</Text>
                                    </View>
                                    <TextInput
                                        style={CheckoutStyle.inputStyle}
                                        onChangeText={(email) => this.setState({email: email})}
                                        value={this.state.email}
                                        onFocus={(event: Event) => {
                                            this._scrollToInput(event.target);
                                        }}
                                        onBlur={(event: Event)=> {
                                            let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,5})$/;
                                            if(reg.test(this.state.email) == false) {
                                                alert('Enter a correct e-mail address');
                                                this.setState({email: ''});
                                                return false;
                                            }
                                        }}
                                    />
                                    {/*<TextInput*/}
                                    {/*    style={[CheckoutStyle.inputStyle,{marginTop:30}]}*/}
                                    {/*    onChangeText={(text) => {*/}
                                    {/*        this.setState({enteredCoupon: text});*/}
                                    {/*        this.state.coupons.forEach((item) => {*/}
                                    {/*            if(item.code === this.state.enteredCoupon){*/}
                                    {/*                this.setState({*/}
                                    {/*                    checkCoupon: true,*/}
                                    {/*                    couponDescription: item.description,*/}
                                    {/*                    amountDiscount: item.amount,*/}
                                    {/*                });*/}
                                    {/*            }*/}
                                    {/*        });*/}
                                    {/*    }}*/}
                                    {/*    onFocus={(event: Event) => {*/}
                                    {/*        this._scrollToInput(event.target);*/}
                                    {/*    }}*/}
                                    {/*    value={this.state.enteredCoupon}*/}
                                    {/*    placeholder={'Coupon code'}*/}
                                    {/*/>*/}
                                    {/*<Text style={{marginBottom:10}}>*/}
                                    {/*    {this.validateCouponCode()}*/}
                                    {/*</Text>*/}
                                    <TextInput
                                        style={[CheckoutStyle.inputStyle,{height:100,alignItems:'flex-start',paddingTop:15,paddingBottom:15}]}
                                        onChangeText={(text) => this.setState({orderComment: text})}
                                        onFocus={(event: Event) => {
                                            this._scrollToInput(event.target);
                                        }}
                                        value={this.state.orderComment}
                                        multiline={true}
                                        placeholder={'Delivery comments'}
                                    />
                                </View>
                            </View>
                        </ScrollView>
                    </KeyboardAwareScrollView>
                    <SafeAreaView  style={CartStyle.bottomSafeAreaView}>
                        <View style={{marginHorizontal: 20,}}>
                            {/*<View style={CartStyle.totalPrice}>*/}
                            {/*    <Text style={[CartStyle.totalPriceText,{fontSize:17}]}>Subtotal:</Text>*/}
                            {/*    <Text style={[CartStyle.totalPriceText,{fontSize:17}]}>${this.state.totalPrice}</Text>*/}
                            {/*</View>*/}
                            {/*<View style={[CartStyle.totalPrice,{marginBottom:20}]}>*/}
                            {/*    <Text style={[CartStyle.totalPriceText,{fontSize:17}]}>Delivery:</Text>*/}
                            {/*    <Text style={[CartStyle.totalPriceText,{fontSize:17}]}>Free!</Text>*/}
                            {/*</View>*/}
                            <View style={[CartStyle.totalPrice,{marginTop:10}]}>
                                <Text style={CartStyle.totalPriceText}>Total:</Text>
                                <Text style={CartStyle.totalPriceText}>${this.state.totalPrice}</Text>
                            </View>
                            <TouchableOpacity style={CartStyle.cartButton} onPress={()=> this.makeOrder() }>
                                <Text style={CartStyle.cartButtonText}>Make order</Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </View>
            );
        } else if (this.state.loading === true) {
            return <LoaderScreen text="Loading..."/>;
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
                        <Text style={CartStyle.cartTitleText}>Checkout</Text>
                    </View>
                </View>
                {this.renderPage()}
            </View>
        )
    };
}
