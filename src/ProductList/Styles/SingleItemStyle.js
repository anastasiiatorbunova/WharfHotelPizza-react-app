import {StyleSheet} from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';

const SingleItemStyle = StyleSheet.create({
    imageContainer: {
        width: '100%',
        marginTop: 15,
        marginBottom: 20,
    },
    infoBlock: {},
    descriptionItem: {
        fontSize: 18,
        lineHeight: 23,
    }
});
export default SingleItemStyle;
