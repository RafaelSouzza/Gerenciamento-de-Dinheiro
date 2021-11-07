import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, TextInput, TouchableOpacity, Modal } from 'react-native';
import { formatNumber } from 'react-native-currency-input';
import CurrencyInput from 'react-native-currency-input';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useMoney } from '../context/Money';

let valueMoney;
let valueDescricao;
let valueKey;

export default function Lucros() {
    const [modalLucro, setModalLucro] = useState(false)
    const [listLucro, setListLucro] = useState([])

    const { setLucro } = useMoney()

    const [lucroMoney, setLucroMoney] = useState('')
    const [descricaoLucro, setDescricaoLucro] = useState('')
    const [key, setKey] = useState(0)
    const [active, setActive] = useState(0)
    const [editLucro, setEditLucro] = useState(false)

    useEffect(async () => {
        const getListLucro = await AsyncStorage.getItem('@lucros')
        const getKey = await AsyncStorage.getItem('@keys')
        if (getListLucro && getKey) {
            setListLucro(JSON.parse(getListLucro))
            setKey(JSON.parse(getKey))
        }
    }, [])

    useEffect(() => {
        async function store() {
            await AsyncStorage.setItem('@lucros', JSON.stringify(listLucro))
            await AsyncStorage.setItem('@keys', JSON.stringify(key))
        }
        store()
    }, [listLucro, key])

    function addLucro() {
        if (lucroMoney == '') {
            Alert.alert('Aviso', 'Algum campo está vazio, preencha para adicionar!')
        }
        else {
            setKey(key + 1)
            let item = {
                key: key,
                value: lucroMoney,
                description: descricaoLucro
            }
            setListLucro([...listLucro, item])
            setActive(true)
        }
    }
    function addEdit() {
        if (valueMoney !== lucroMoney || valueDescricao !== descricaoLucro) {
            listLucro.splice(valueKey, 1, { key: valueKey, value: lucroMoney, description: descricaoLucro })
            setActive(true)
            backPage()
        }
        else {
            Alert.alert('Aviso!', 'Não houve nenhuma edição no valor ou descrição!')
        }
    }

    useEffect(() => {
        if (active) {
            setLucroMoney('')
            setDescricaoLucro('')
            setModalLucro(false)

            let soma = listLucro.map((result) => result.value)
            if (soma.length > 0) {
                let somaFinal = soma.reduce((value1, value2) => value1 + value2)
                setLucro(somaFinal)
            }
            else if (soma.length == 0) {
                setLucro(0)
            }
            setActive(false)
        }

    }, [active])

    function backPage() {
        setEditLucro(false)
        setModalLucro(false)
        setLucroMoney('')
        setDescricaoLucro('')
    }

    const List = ({ data }) => {
        const formattedValue = formatNumber(data.value, {
            separator: ',',
            prefix: 'R$ ',
            precision: 2,
            delimiter: '.',
        });

        function deleteItem(value) {
            Alert.alert('Aviso!', 'Você realmente quer deletar esse item?', [{ text: 'Não', onPress: () => { return } }, {
                text: 'Sim', onPress: () => {
                    const filterList = listLucro.filter((result) => result.key !== value)
                    setListLucro(filterList)
                    setActive(true)
                }
            }])
        }
        function editItem(data) {
            setLucroMoney(data.value)
            setDescricaoLucro(data.description)
            setEditLucro(true)
            valueMoney = data.value;
            valueDescricao = data.description;
            valueKey = data.key;
        }

        return (
            <View style={{ flex: 1, backgroundColor: '#CEFF9F', width: 350, alignSelf: 'center', padding: 20, borderWidth: 2, borderColor: '#B3FF6B', marginTop: 10, flexDirection: 'row', borderRadius: 10 }}>
                <View>
                    <Text style={styles.valueList}>+{formattedValue}</Text>
                    <Text style={styles.descricaoList}>Descrição: {data.description}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={{ padding: 3, justifyContent: 'center' }} onPress={() => editItem(data)}>
                        <Icon name="pencil" size={30} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ padding: 3, justifyContent: 'center' }} onPress={() => deleteItem(data.key)}>
                        <Icon name="trash-can-outline" size={30} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.titleList}>Lista de Lucros:</Text>
            <FlatList renderItem={({ item }) => <List data={item} />} data={listLucro} keyExtractor={(item) => String(item.key)} />

            <Modal visible={modalLucro}>
                    <View style={{ backgroundColor: '#B8FF89', flex: 1 }}>
                        <Text style={styles.titleModal}>ADICIONAR NOVO ITEM:</Text>
                        <TouchableOpacity style={styles.buttonBack} onPress={backPage}>
                            <Icon name="arrow-left-bold" size={50} color="#000" />
                        </TouchableOpacity>
                        <Text style={styles.labelLucro}>Valor: </Text>
                        <CurrencyInput prefix="$" delimiter="." separator="," precision={2} style={styles.inputLucro} placeholder="R$" placeholderTextColor="#000" onChangeValue={text => setLucroMoney(text)} value={lucroMoney} />
                        <Text style={styles.labelDescricao}>Descrição: </Text>
                        <TextInput style={styles.inputDescricao} multiline={true} placeholder='Descrição...' placeholderTextColor="#000" onChangeText={text => setDescricaoLucro(text)} value={descricaoLucro} />
                        <TouchableOpacity style={styles.buttonAddLucro} onPress={addLucro}>
                            <Text style={styles.textAddLucro}>ADICIONAR</Text>
                        </TouchableOpacity>
                    </View>
            </Modal>

            <Modal visible={editLucro}>
                <View style={{ backgroundColor: '#B8FF89', flex: 1 }}>
                    <Text style={styles.titleModal}>EDITAR ITEM:</Text>
                    <TouchableOpacity style={styles.buttonBack} onPress={backPage}>
                        <Icon name="arrow-left-bold" size={50} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.labelLucro}>Valor: </Text>
                    <CurrencyInput prefix="$" delimiter="." separator="," precision={2} style={styles.inputLucro} placeholder="R$" placeholderTextColor="#000" onChangeValue={text => setLucroMoney(text)} value={lucroMoney} />
                    <Text style={styles.labelDescricao}>Descrição: </Text>
                    <TextInput style={styles.inputDescricao} multiline={true} placeholder='Descrição...' placeholderTextColor="#000" onChangeText={text => setDescricaoLucro(text)} value={descricaoLucro} />
                    <TouchableOpacity style={styles.buttonAddLucro} onPress={addEdit}>
                        <Text style={styles.textAddLucro}>EDITAR</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            <TouchableOpacity style={styles.buttonMore} onPress={() => setModalLucro(true)}>
                <Icon name="plus" size={50} color="#000" />
            </TouchableOpacity>
        </View >

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E6FFD4'
    },
    titleList: {
        fontSize: 22,
        fontWeight: 'bold',
        margin: 20,
        padding: 15,
        borderRadius: 100,
        textAlign: 'center',
        backgroundColor: '#C4F68C'
    },
    buttonMore: {
        width: 70,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#8DF01E',
        borderRadius: 100,
        position: 'absolute',
        bottom: 20,
        right: 20
    },
    buttonBack: {
        position: 'absolute',
        top: 20,
        left: 10
    },
    titleModal: {
        fontSize: 19,
        fontWeight: 'bold',
        marginTop: 16,
        marginLeft: 75,
        padding: 15,
        color: '#000'
    },
    labelLucro: {
        fontSize: 20,
        marginBottom: 5,
        fontWeight: '700',
        marginLeft: 30,
        marginTop: 40
    },
    inputLucro: {
        marginLeft: 30,
        padding: 10,
        backgroundColor: '#E5FFD3',
        width: 350,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#BFFF95',
        fontSize: 17,
        color: '#000'
    },
    labelDescricao: {
        marginTop: 15,
        marginBottom: 5,
        fontSize: 20,
        fontWeight: '700',
        marginLeft: 30
    },
    inputDescricao: {
        marginLeft: 30,
        padding: 10,
        backgroundColor: '#E5FFD3',
        width: 350,
        height: 150,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#BFFF95',
        fontSize: 17,
        textAlignVertical: 'top',
        color: '#000'
    },
    buttonAddLucro: {
        position: 'absolute',
        bottom: 8,
        alignSelf: 'center',
        backgroundColor: '#74FF14',
        width: 350,
        borderRadius: 15
    },
    textAddLucro: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 10,
        textAlign: 'center',
        color: '#000'
    },
    valueList: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#45990E',
        padding: 0,
        margin: -5
    },
    descricaoList: {
        fontSize: 17,
        fontWeight: '700',
        color: '#61A932',
        width: 250
    }
})