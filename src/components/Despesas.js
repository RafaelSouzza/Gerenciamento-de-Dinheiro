import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, TextInput, TouchableOpacity, Modal } from 'react-native';
import { formatNumber } from 'react-native-currency-input';
import CurrencyInput from 'react-native-currency-input';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {useMoney} from '../context/Money'

import AsyncStorage from '@react-native-async-storage/async-storage';

let valueMoney;
let valueDescricao;
let valueKey;
export default function Despesas() {

    const [modalDespesa, setModalDespesa] = useState(false)
    const [despesaMoney, setDespesaMoney] = useState('')
    const [descricaoDespesa, setDescricaoDespesa] = useState('')
    const [key, setKey] = useState(0)
    const [listDespesa, setListDespesa] = useState([])
    const [active, setActive] = useState(false)
    const [editDespesa, setEditDespesa] = useState(false)

    const {setDespesa} = useMoney()

    function addDespesa() {
        if (despesaMoney == '') {
            Alert.alert('Aviso', 'Algum campo está vazio, preencha para adicionar!')
        }
        else {
            setKey(key + 1)
            let item = {
                key: key,
                value: despesaMoney,
                description: descricaoDespesa
            }
            setListDespesa([...listDespesa, item])
            setActive(true)
        }
    }

    useEffect(async () => {
        const getListDespesa = await AsyncStorage.getItem('@despesas')
        const getKey = await AsyncStorage.getItem('@keysDespesa')
        if (getListDespesa && getKey) {
            setListDespesa(JSON.parse(getListDespesa))
            setKey(JSON.parse(getKey))
        }
    }, [])

    useEffect(() => {
        async function store() {
            await AsyncStorage.setItem('@despesas', JSON.stringify(listDespesa))
            await AsyncStorage.setItem('@keysDespesa', JSON.stringify(key))
        }
        store()
    }, [listDespesa, key])
    useEffect(() => {
        if(active){
            setDespesaMoney('')
            setDescricaoDespesa('')
            setModalDespesa(false)
    
            let soma = listDespesa.map((result) => result.value)
            if (soma.length > 0) {
                let somaFinal = soma.reduce((value1, value2) => value1 + value2)
                setDespesa(somaFinal)
            }
            else if(soma.length == 0){
                setDespesa(0)
            }
            setActive(false)
        }
    }, [active])

    function addEdit() {
        if (valueMoney !== despesaMoney || valueDescricao !== descricaoDespesa) {            
            listDespesa.splice(valueKey, 1, { key: valueKey, value: despesaMoney, description: descricaoDespesa })
            setActive(true)
            backPage()
        }
        else{
            Alert.alert('Aviso!','Não houve nenhuma edição no valor ou descrição!')
        }
    }
    function backPage() {
        setEditDespesa(false)
        setModalDespesa(false)
        setDespesaMoney('')
        setDescricaoDespesa('')
    }

    const List = ({data}) => {
        const formattedValue = formatNumber(data.value, {
            separator: ',',
            prefix: 'R$ ',
            precision: 2,
            delimiter: '.',
        });

        function deleteItem(value) {
            Alert.alert('Aviso!', 'Você realmente quer deletar esse item?', [{ text: 'Não', onPress: () => { return } }, {
                text: 'Sim', onPress: () => {
                    const filterList = listDespesa.filter((result) => result.key !== value)
                    setListDespesa(filterList)
                    setActive(true)
                }
            }])
        }

        function editItem(data) {
            setDespesaMoney(data.value)
            setDescricaoDespesa(data.description)
            setEditDespesa(true)
            valueMoney = data.value;
            valueDescricao = data.description;
            valueKey = data.key;
        }
        return (
            <View style={{ flex: 1, backgroundColor: '#FFC2C2', width: 350, alignSelf: 'center', padding: 20, borderWidth: 2, borderColor: '#FFAEAE', marginTop: 10, flexDirection: 'row', borderRadius:10 }}>
                <View>
                    <Text style={styles.valueList}>-{formattedValue}</Text>
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
            <Text style={styles.titleList}>VALORES DE DÍVIDAS:</Text>
            <FlatList renderItem={({ item }) => <List data={item} />} data={listDespesa} keyExtractor={(item) => String(item.key)} />
            <Modal visible={modalDespesa}>
                <View style={{ backgroundColor: '#FFD9D9', flex: 1 }}>
                    <Text style={styles.titleModal}>ADICIONAR NOVO ITEM:</Text>
                    <TouchableOpacity style={styles.buttonBack} onPress={backPage}>
                        <Icon name="arrow-left-bold" size={50} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.labelDespesa}>Valor: </Text>
                    <CurrencyInput prefix="$" delimiter="." separator="," precision={2} style={styles.inputDespesa} placeholder="R$" placeholderTextColor="#000" onChangeValue={text => setDespesaMoney(text)} value={despesaMoney} />
                    <Text style={styles.labelDescricao}>Descrição: </Text>
                    <TextInput style={styles.inputDescricao} multiline={true} placeholder='Descrição...' placeholderTextColor="#000" onChangeText={text => setDescricaoDespesa(text)} value={descricaoDespesa} />
                    <TouchableOpacity style={styles.buttonAddDespesa} onPress={addDespesa}>
                        <Text style={styles.textAddDespesa}>ADICIONAR</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            <Modal visible={editDespesa}>
                <View style={{ backgroundColor: '#FFD9D9', flex: 1 }}>
                    <Text style={styles.titleModal}>EDITAR ITEM:</Text>
                    <TouchableOpacity style={styles.buttonBack} onPress={backPage}>
                        <Icon name="arrow-left-bold" size={50} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.labelDespesa}>Valor: </Text>
                    <CurrencyInput prefix="$" delimiter="." separator="," precision={2} style={styles.inputDespesa} placeholder="R$" placeholderTextColor="#000" onChangeValue={text => setDespesaMoney(text)} value={despesaMoney} />
                    <Text style={styles.labelDescricao}>Descrição: </Text>
                    <TextInput style={styles.inputDescricao} multiline={true} placeholder='Descrição...' placeholderTextColor="#000" onChangeText={text => setDescricaoDespesa(text)} value={descricaoDespesa} />
                    <TouchableOpacity style={styles.buttonAddDespesa} onPress={addEdit}>
                        <Text style={styles.textAddDespesa}>EDITAR</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            <TouchableOpacity style={styles.buttonMore} onPress={()=>setModalDespesa(true)}>
                <Icon name="plus" size={50} color="#000" />
            </TouchableOpacity>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFE6E6'
    },
    titleList: {
        fontSize: 22,
        fontWeight: 'bold',
        margin: 20,
        padding: 15,
        borderRadius: 100,
        textAlign: 'center',
        backgroundColor: '#FF9393'
    },
    buttonMore: {
        width: 70,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF6262',
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
    labelDespesa: {
        fontSize: 20,
        marginBottom: 5,
        fontWeight: '700',
        marginLeft: 30,
        marginTop: 40
    },
    inputDespesa: {
        marginLeft: 30,
        padding: 10,
        backgroundColor: '#FF9090',
        width: 350,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#FF9393',
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
        backgroundColor: '#FF9090',
        width: 350,
        height: 150,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#FF9393',
        fontSize: 17,
        textAlignVertical: 'top',
        color: '#000'
    },
    buttonAddDespesa: {
        position: 'absolute',
        bottom: 8,
        alignSelf: 'center',
        backgroundColor: '#FF5050',
        width: 350,
        borderRadius: 15
    },
    textAddDespesa: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 10,
        textAlign: 'center',
        color: '#000'
    },
    valueList: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FF4242',
        padding: 0,
        margin: -5
    },
    descricaoList: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FF6565',
        width: 250
    }
})