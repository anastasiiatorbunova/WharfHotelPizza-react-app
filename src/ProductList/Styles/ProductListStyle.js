import {StyleSheet} from 'react-native';

const ProductListStyle = StyleSheet.create({
    container: {
        //backgroundColor: '#fff',
        paddingHorizontal: 20,
    },
    bottomSafeAreaView: {

    },
    categoryBlock: {
        marginVertical: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    categoryButton: {
        width: '32%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ffc20e',
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    categoryButtonActive: {
        backgroundColor: '#ffc20e',
    },
    categoryText: {

    },
    titleTextBlock: {
        marginTop: 20,
        marginBottom: 10,
    },
    titleText: {
        fontSize: 24,
    },
    orderedProductsBlock: {

    },
    imageProduct: {
      width: '100%',
      height: 200,
      resizeMode:'cover',
    },
    featuresBlock: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    productTitle: {
        fontSize: 20,
        marginBottom: 10,
        marginTop: 5,
    },
    productPrice: {
        fontSize: 20,
    },
    quantityText:{
        fontSize: 16,
        width: 25,
        textAlign: 'center',
    },
    addToCartButton: {
        width: 90,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ffc20e',
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    actionQuantityButton: {
        marginHorizontal: 7,
        width: 30,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ffc20e',
    },
});

export default ProductListStyle;
