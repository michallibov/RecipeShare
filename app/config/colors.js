import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(231, 217, 203, 220)',
    },
    addButton: {
        backgroundColor: '#6e492a',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonTextStyle: {
        color: 'white',
        fontWeight: 'bold',
        textShadowColor: 'black',
    },
});

export default globalStyles;