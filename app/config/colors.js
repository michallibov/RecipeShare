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
    errorMessage: {
        color: 'darkred',
        fontWeight: 'bold',
    },
    errorBox: {
        padding: 4,
        marginTop: 4,
        backgroundColor: 'salmon',
        borderWidth: 1,
        borderColor: 'darkred',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default globalStyles;