import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EBF5FB',
        borderTopWidth:5
    },
    titlePage: {
        fontSize: 21,
        fontWeight: 'bold',
        margin: 15,
        borderRadius:10,
        padding: 15,
        textAlign: 'center',
        backgroundColor: '#229954',
        color:'#FFF'
    },
    buttonMore: {
        width: 65,
        height: 65,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3498DB',
        borderRadius: 100,
        position: 'absolute',
        bottom: 10,
        right: 10
    },
    containerModal: {
        backgroundColor: '#EBF5FB',
        flex: 1
    },
    titleModal: {
        fontSize: 19,
        fontWeight: 'bold',
        padding: 15,
        color: '#000'
    },
    inputModal: {
        padding: 10,
        backgroundColor: '#D6EAF8',
        width: 350,
        borderRadius: 10,
        borderTopLeftRadius: 0,
        borderWidth: 1.5,
        borderColor: '#5DADE2',
        fontSize: 17,
        color: '#000',
        alignSelf:'center'
    },
    labelsModal: {
        fontSize: 19,
        color: '#FFF',
        fontWeight: '700',
        marginTop: 15,
        backgroundColor: '#85C1E9',
        width: 170,
        marginBottom: -1,
        padding: 5,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        textAlign:'center',
    },
    buttonAddItem: {
        position: 'absolute',
        bottom: 8,
        alignSelf: 'center',
        backgroundColor: '#3498DB',
        width: 350,
        borderRadius: 15,
    },
    textButtonAdd: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 10,
        textAlign: 'center',
        color: '#FFF'
    },
    titleName: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#FFF',
        padding: 5,
        marginTop: 15,
        textAlign: 'center',
        backgroundColor: '#229954',
        width: 350,
        alignSelf: 'center'
    },
    valueList: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        padding: 0,
        marginLeft: -5
    },
    descricaoList: {
        fontSize: 17,
        fontWeight: '700',
        color: '#000',
        width: 250,
        marginLeft: -5
    },
    viewItem: {
        flex: 1,
        backgroundColor: '#A9DFBF',
        width: 350,
        alignSelf: 'center',
        padding: 20,
        flexDirection: 'row',
        borderColor: '#D5F5E3',
        borderBottomWidth: 1,
    },
    textIncludeItem: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#FFF',
        padding: 8,
        textAlign: 'center',
        backgroundColor: '#27AE60',
        width: 350,
        alignSelf: 'center',
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
    },
    inputPortion:{
        marginLeft: 30,
        padding: 10,
        backgroundColor: '#D6EAF8',
        width: 170,
        borderRadius: 10,
        borderTopLeftRadius: 0,
        borderTopRightRadius:0,
        borderWidth: 1.5,
        borderColor: '#5DADE2',
        fontSize: 17,
        color: '#000',
    },
    inputSearch:{
        backgroundColor:'#AED6F1',
        color:'#000',
        width:280,
        height:55,
        marginRight:0,
        borderTopLeftRadius:15,
        borderBottomLeftRadius:15
    },
    buttonSearch:{
        alignSelf:'center',
        backgroundColor:'#5DADE2',
        padding:4,
        borderRightWidth:1,
        borderColor:'#AED6F1'
    },
    buttonCategory:{
        alignSelf:'center',
        backgroundColor:'#5DADE2',
        padding:4,
        borderTopRightRadius:15,
        borderBottomRightRadius:15
    }
})