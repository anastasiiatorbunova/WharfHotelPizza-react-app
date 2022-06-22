import {StyleSheet} from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';

const AppHeaderStyle = StyleSheet.create({
    safeArea: {
        backgroundColor: '#ffffff',
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 40,
        paddingBottom: 10,
        paddingHorizontal: 20,
        marginTop: ifIphoneX(0, 10),
    },
    headerLogo: {
        width: 80,
        height: 45,
        resizeMode: 'contain',
    },
    headerCartIcon: {
        height: 30,
        width: 40,
        resizeMode: 'contain',
    },
});

export default AppHeaderStyle;
