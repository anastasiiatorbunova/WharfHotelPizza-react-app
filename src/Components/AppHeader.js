import React from 'react';
import {
    View,
    Image,
    Text,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import AppHeaderStyle from './Styles/AppHeaderStyle';

export default class AppHeader extends React.Component {
    goToPage = async route => {
        this.props.navigation.navigate(route);
    };

    render() {
        return (
            <SafeAreaView style={AppHeaderStyle.safeArea}>
                <View style={AppHeaderStyle.container}>
                    <TouchableOpacity onPress={() => { this.goToPage('ProductList'); }}>
                        <View>
                            <Image source={require('../../assets/logo.png')} style={AppHeaderStyle.headerLogo} />
                        </View>
                    </TouchableOpacity>
                    <View>
                        <TouchableOpacity onPress={() => { this.goToPage('Cart'); }}>
                            <View>
                                <Image source={require('../../assets/cart.png')} style={AppHeaderStyle.headerCartIcon} />
                                {/*<Text style={{position: 'absolute', right: 12, top: 10, fontSize: 13,}}>10</Text>*/}
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}
