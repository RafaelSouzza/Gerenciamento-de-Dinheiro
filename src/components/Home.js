import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { formatNumber } from 'react-native-currency-input';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useMoney } from '../context/Money';

export default function Home() {
    const { money, lucro, despesa, activePassword, setActivePassword, passwordScreen } = useMoney()
    const [modal, setModal] = useState(false)
    const [blockPassword, setBlockPassword] = useState('')
    const [wrongPassword, setWrongPassword] = useState(false)
    const valueLucro = formatNumber(lucro, {
        separator: ',',
        prefix: 'R$ ',
        precision: 2,
        delimiter: '.'
    });
    const valueDespesa = formatNumber(despesa, {
        separator: ',',
        prefix: 'R$ ',
        precision: 2,
        delimiter: '.',
    });
    const valueMoney = formatNumber(money, {
        separator: ',',
        prefix: 'R$ ',
        precision: 2,
        delimiter: '.',
        signPosition: 'beforePrefix'
    });

    /* useEffect(async () => {
        const getStoreActivePassword = await AsyncStorage.getItem('@activePassword')
        if (getStoreActivePassword) {
            setModal(true)
        }
    }, [])
    function verifyPassword() {
        if (blockPassword === passwordScreen) {
            setModal(false)
            setWrongPassword(false)
        }
        else{
            setWrongPassword(true)
        }
    } */

    return (
        <View style={styles.container}>
            <View>
                <View>
                    <Text style={styles.titleLucro}>TOTAL A RECEBER: </Text>
                    <Text style={styles.valueLucro}>{valueLucro}</Text>
                </View>
                <View>
                    <Text style={styles.titleDespesa}>TOTAL À PAGAR: </Text>
                    <Text style={styles.valueDespesa}>{valueDespesa}</Text>
                </View>
                <View>
                    <View style={{ backgroundColor: '#6FB6EA', marginLeft: 8, marginRight: 8, marginTop: 25, padding: 15, borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
                        <Text style={styles.titleMoney}>DINHEIRO LÍQUIDO:</Text>
                        <Text style={styles.subTitleMoney}>(DINHEIRO LÍQUIDO é calculado apartir da subtração do valor da despesa sobre o valor do lucro!)</Text>
                    </View>
                    {money < 0 ? <Text style={styles.valueMoneyNega}>{valueMoney}</Text> : <Text style={styles.valueMoneyPosi}>+{valueMoney}</Text>}
                </View>
                {/* <Modal visible={modal}>
                    <View style={{ flex: 1, backgroundColor: '#34495E', justifyContent: 'center' }}>
                        <Text style={styles.titleScreenBlock}>Tela de Bloqueio</Text>
                        <View>
                            <Text style={styles.labelBlockPassword}>Insira a senha:</Text>
                            <TextInput style={styles.inputBlockPassword} secureTextEntry={true} value={blockPassword} onChangeText={(text) => setBlockPassword(text)} />
                            {wrongPassword&&<Text style={styles.wrongPassword}>Senha incorreta!</Text>}
                            <TouchableOpacity style={styles.buttonSubmitPassword} onPress={verifyPassword}>
                                <Text style={styles.textButtonSubmitPassword}>DESBLOQUEAR</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal> */}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E3F2FF'
    },
    titleMoney: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    subTitleMoney: {
        fontSize: 13,
        textAlign: 'center',
        fontStyle: 'italic'
    },
    valueMoneyPosi: {
        textAlign: 'center',
        fontSize: 20,
        padding: 20,
        backgroundColor: '#B8E0FF',
        marginLeft: 8,
        marginRight: 8,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        color: '#38D226'

    },
    valueMoneyNega: {
        textAlign: 'center',
        fontSize: 20,
        padding: 20,
        backgroundColor: '#B8E0FF',
        marginLeft: 8,
        marginRight: 8,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        color: '#FF2F2F'
    },
    titleLucro: {
        fontSize: 20,
        fontWeight: 'bold',
        backgroundColor: '#5CFF00',
        padding: 15,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        textAlign: 'center',
        marginLeft: 8,
        marginRight: 8,
        marginTop: 25
    },
    valueLucro: {
        textAlign: 'center',
        fontSize: 20,
        padding: 20,
        backgroundColor: '#D1FFB7',
        marginLeft: 8,
        marginRight: 8,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15
    },
    titleDespesa: {
        fontSize: 20,
        fontWeight: 'bold',
        backgroundColor: '#FF6161',
        padding: 15,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        textAlign: 'center',
        marginLeft: 8,
        marginRight: 8,
        marginTop: 25
    },
    valueDespesa: {
        textAlign: 'center',
        fontSize: 20,
        padding: 20,
        backgroundColor: '#FFA1A1',
        marginLeft: 8,
        marginRight: 8,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15
    },
    buttonProfits: {
        position: 'absolute',
        bottom: 40,
        left: 30
    },
    labelButtonProfits: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: 'green'
    },
    buttonExpenses: {
        position: 'absolute',
        bottom: 40,
        right: 30
    },
    labelButtonExpenses: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: 'red'
    },
    imageButtonInMain: {
        width: 90,
        height: 90
    },
    titleScreenBlock: {
        fontSize: 26,
        textAlign: 'center',
        color: '#FFF',
        fontWeight: 'bold',
        padding: 30,
        alignSelf: 'center',
        marginBottom: 30
    },
    labelBlockPassword: {
        color: '#FFF',
        padding: 10,
        marginLeft: 10,
        fontSize: 18
    },
    inputBlockPassword: {
        width: 380,
        backgroundColor: '#FFF',
        alignSelf: 'center',
        margin: 5,
        borderRadius: 8,
        color: '#000'
    },
    buttonSubmitPassword: {
        alignItems: 'center',
        padding: 15,
        marginTop: 30,
        width: 380,
        backgroundColor: '#2E4053',
        alignSelf: 'center',
        borderRadius: 15
    },
    textButtonSubmitPassword: {
        fontSize: 18,
        color: '#FFF',

    },
    wrongPassword:{
        fontSize:14,
        fontStyle:'italic',
        padding:3,
        marginLeft:6,
        color:'#FF0000'
    }
})