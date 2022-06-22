import React from "react";
import {View, Image, Text, StyleSheet, ActivityIndicator} from 'react-native';

import LoaderScreenStyle from './Styles/LoaderScreenStyle';

export default class LoaderScreen extends React.Component {
    getText() {
        if (this.props.text){
            return this.props.text;
        }
        else {
            return 'Загрузка...';
        }
    }

    render() {
        return (
            <View style = {LoaderScreenStyle.container}>
                <View  style = {LoaderScreenStyle.loaderBlock}>
                <ActivityIndicator
                    color = '#000'
                    size = "large"
                    style = {LoaderScreenStyle.activityIndicator}/>
                    <Text>{this.getText()}</Text>
                </View>
            </View>
        );
    }
}

