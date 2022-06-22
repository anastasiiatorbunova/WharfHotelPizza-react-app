import {StyleSheet} from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';

const CheckoutStyle = StyleSheet.create({
    inputStyle: {
        height: 50,
        width: '100%',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 10,
        fontSize: 18,
        alignItems: 'center',
        paddingHorizontal: 15,
        marginTop: 5,
        marginBottom: 10,
    },
    textForInput: {
        fontSize: 20,
    },
    requiredText: {
        color: '#ff0000',
        fontSize: 20,
    },
});

export default CheckoutStyle;
