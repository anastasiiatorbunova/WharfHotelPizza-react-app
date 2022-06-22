import React from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Image,
    TouchableOpacity,
    Alert,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import AppComponent from '../AppComponent';
import LoaderScreen from '../Components/LoaderScreen';
import AppHeader from '../Components/AppHeader';

import BodyStyle from '../BodyStyle';
import SuccessOrderStyle from './Styles/SuccessOrderStyle';
import {ScrollView} from "react-navigation";
import CartStyle from "./Styles/CartStyle";

const GLOBALS = require('../settings/Globals');

export default class SuccessOrder extends AppComponent {


    render(){
        return(
            <View style={BodyStyle.pageLayout}>
                <View style={{flex:1,}}>
                    <View style={[CartStyle.pageContent,{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:20}]}>
                        <View>
                            <Image source={require('../../assets/tick_done.png')} style={{width:130,height:130,marginBottom:30,}}/>
                        </View>
                        <Text style={[CartStyle.totalPriceText,{fontSize:25,textAlign:'center'}]}>Your order have successfully done!</Text>
                    </View>
                    <SafeAreaView  style={CartStyle.bottomSafeAreaView}>
                        <View style={{marginHorizontal: 20,}}>
                            <TouchableOpacity style={CartStyle.cartButton} onPress={()=> this.props.navigation.navigate('ProductList') }>
                                <Text style={CartStyle.cartButtonText}>Go To Main Page</Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </View>
            </View>
        )
    };
}
