import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    h1: {
        color: '#096324',
        fontSize: 30,
        fontWeight: '600',
    },
    h3: {
        color: '#096324',
        marginTop: 20,
        marginBottom: 40,
        fontSize: 24,
        fontWeight: '600',
    },
    a: {
        color: '#096324',
    },
    p: {
        fontSize: 18,
    },
    headerEmail: {
        color: '#096324',
        marginBottom: 10,
    },
    finePrint: {
        fontSize: 16,
    },
    body: {
        fontFamily: 'sans-serif',
        padding: 0,
        margin: 0,
    },
    hRow: {
        display: 'flex',
        alignItems: 'flex-end',
        flex: 1,
    },
    pageContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
    },
    pageHeader: {
        flex: 0,
        display: 'flex',
        flexDirection: 'column',
    },
    logoHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        height: 150,
        marginHorizontal: 10,
    },
    menuBar: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#096324',
    },
    menuLink: {
        // fontSize: 20,
        fontWeight: '600',
        color: '#ffffff',
        // marginLeft: 40,
        textDecorationLine: 'underline',
    },
    inactive: {
        textDecorationLine: 'none',
    },
    buttonLg: {
        backgroundColor: '#096324',
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
        borderRadius: 10,
        textAlign: 'center',
        paddingHorizontal: 15,
        paddingVertical: 5,
        textDecorationLine: 'none',
    },
    columnContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    contentContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 60,
        paddingRight: 20,
        paddingBottom: 20,
        paddingLeft: 40,
    },
    balance: {
        fontSize: 50,
        fontWeight: '800',
    },
    changeLabel: {
        fontSize: 20,
        marginRight: 5,
    },
    changeInput: {
        fontSize: 20,
        height: 40,
        textAlign: 'right',
        paddingRight: 10,
    },
    changeSubmit: {
        fontSize: 15,
        height: 40,
        marginLeft: 15,
        borderRadius: 5,
    },
    changeMessage: {
        fontSize: 20,
        marginBottom: 15,
    },
    errorMessage: {
        fontSize: 20,
        color: '#ff0000',
        marginBottom: 15,
    },
    appContainer: {
        flex: 0,
        display: 'flex',
        flexDirection: 'column',
        marginTop: 40,
        marginHorizontal: 20,
    },
    changeContainer: {
        flex: 1,
    },
    image: {
        flex: 1,
        height: '100%',
    }
});
