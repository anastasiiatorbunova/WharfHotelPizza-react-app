import {StyleSheet} from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';

const CartStyle = StyleSheet.create({
    headerWrapper: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        padding: 20,
        paddingBottom: 10,
        paddingTop: ifIphoneX(50,10),
    },
    cartTitleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cartTitleText: {
        fontSize: 25,
    },
    goBackIcon: {
        width: 25,
        justifyContent: 'center'
    },
    pageContent:{
        backgroundColor: '#ffffff',
        flex: 1,
    },
    container: {
        paddingHorizontal: 20,
    },
    itemContainer: {
        flexDirection: 'row',
        marginVertical: 10,
    },
    itemInfo: {
        width: '25%',
    },
    itemTitle: {
        width: '65%',
    },
    itemDelete: {
        width: '10%',
        flexDirection: 'row-reverse',
    },
    itemDeleteImage: {
        width: 20,
        height: 10,
        resizeMode: 'contain'
    },
    itemDeleteButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 25,
        height: 25,
        borderRadius: 12.5,
        backgroundColor: '#ffc20e'
    },
    itemTextPrice: {
        fontSize: 18,
    },
    itemText: {
        fontSize: 20,
    },
    bottomSafeAreaView:{
        backgroundColor: '#ffffff',
    },
    cartButton: {
        width: '100%',
        height: 50,
        borderRadius: 25,
        backgroundColor: '#ffc20e',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: ifIphoneX(0, 15),
    },
    cartButtonText: {
        fontSize: 20,
        letterSpacing: 0.7,
    },
    totalPrice: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    totalPriceText:{
        fontSize: 22,
    },
    emptyPageText:{
        fontSize: 20,
    },
});

export default CartStyle;
