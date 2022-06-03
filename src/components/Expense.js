import React, { useState, useEffect } from 'react';
import { View, Text, Alert, FlatList, TextInput, Keyboard, ScrollView, SafeAreaView, TouchableOpacity, Modal } from 'react-native';
import { formatNumber } from 'react-native-currency-input';
import CurrencyInput from 'react-native-currency-input';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import css from '../styles/css';
import { useMoney } from '../context/Money';

let valueEdit;
let valueItemData;

export default function Expense() {

    const [modalAdd, setModalAdd] = useState(false)
    const [list, setList] = useState([])
    const [money, setMoney] = useState('')
    const [listName, setListName] = useState('')
    const [description, setDescription] = useState('')
    const [key, setKey] = useState(1)
    const [active, setActive] = useState(0)
    const [modalEdit, setModalEdit] = useState(false)
    const [modalInclude, setModalInclude] = useState(false)

    const { setDespesa } = useMoney()

    useEffect(async () => {
        const getlist = await AsyncStorage.getItem('@despesas')
        const getKey = await AsyncStorage.getItem('@keysDespesa')
        if (getlist && getKey) {
            setList(JSON.parse(getlist))
            setKey(JSON.parse(getKey))
        }
    }, [])

    useEffect(() => {
        async function store() {
            await AsyncStorage.setItem('@despesas', JSON.stringify(list))
            await AsyncStorage.setItem('@keysDespesa', JSON.stringify(key))
        }
        store()
    }, [list, active])

    useEffect(() => {
        if (active) {
            setListName('')
            setMoney('')
            setDescription('')
            setModalInclude(false)
            setModalAdd(false)
            let subFinal = []
            list.map((result) => {
                let valor = result.info
                valor.map((values) => subFinal.push(values.value))
            })
            subFinal = subFinal.reduce((value1, value2) => value1 + value2)
            setDespesa(subFinal)
            setActive(false)
        }

    }, [active])

    function addLucro() {
        if (money == '') {
            Alert.alert('Aviso', 'Algum campo está vazio, preencha para adicionar!')
        }
        let verificy = list.map((value) => value.nameList.toLowerCase()).indexOf(listName.toLowerCase())
        if (verificy >= 0) {
            let index = list.findIndex((element) => { return element.nameList == listName })
            let itemList = {
                key: key,
                value: money,
                description: description
            }
            list[index].info.push(itemList)

            setKey(key + 1)
            setActive(true)
        }
        else {
            let itemList = {
                nameList: listName,
                info: [{
                    key: key,
                    value: money,
                    description: description
                }]
            }
            setList([...list, itemList])
            setKey(key + 1)
            setActive(true)
        }
    }
    function addEdit() {
        let verificy = list.map((value) => value.nameList.toLowerCase()).indexOf(listName.toLowerCase())
        if (verificy >= 0 && valueItemData.nameList !== listName) {
            let filterIndex = valueItemData.info.findIndex((element) => { return element.key == valueEdit.key })
            valueItemData.info.splice(filterIndex, 1)
            setActive(true)
            let index = list.findIndex((element) => { return element.nameList == listName })
            let itemList = {
                key: valueEdit.key,
                value: money,
                description: description
            }
            list[index].info.push(itemList)
            setActive(true)
            backPage()
        }
        if (valueEdit.value !== money || valueEdit.description !== description || valueItemData.nameList == listName) {
            let itemList = {
                key: valueEdit.key,
                value: money,
                description: description
            }
            let filterIndex = valueItemData.info.findIndex((element) => { return element.key == valueEdit.key })
            valueItemData.info.splice(filterIndex, 1, itemList)
            setActive(true)
            backPage()
        }
        if (valueEdit.value === money && valueEdit.description === description && valueItemData.nameList === listName) {
            Alert.alert('Aviso!', 'Não houve nenhuma edição no valor ou descrição!')
        }
    }

    function backPage() {
        setModalEdit(false)
        setModalAdd(false)
        setListName('')
        setMoney('')
        setDescription('')
    }

    const List = ({ data, values }) => {
        function formattedValue(valor) {
            return (
                formatNumber(valor, {
                    separator: ',',
                    prefix: 'R$ ',
                    precision: 2,
                    delimiter: '.',
                })
            )

        }
        function deleteItem(value, itemData) {

            Alert.alert('Aviso!', 'Você realmente quer deletar esse item?', [{ text: 'Não', onPress: () => { return } }, {
                text: 'Sim', onPress: () => {
                    let filterItem = itemData.info.findIndex((element) => { return element.key == value.key })
                    itemData.info.splice(filterItem, 1)
                    if (itemData.info.length == 0) {
                        let filterNameList = list.findIndex((element) => { return element.nameList == itemData.nameList })
                        list.splice(filterNameList, 1)
                    }
                    setActive(true)
                }
            }])
        }
        function editItem(value, itemData) {
            setListName(itemData.nameList)
            setMoney(value.value)
            setDescription(value.description)
            setModalEdit(true)
            valueEdit = value
            valueItemData = itemData
        }
        function includeItem() {
            setListName(data.nameList)
            setModalInclude(true)
            setModalAdd(true)
        }
        return (
            <View>
                <Text style={[css.titleName,{backgroundColor:'#CB4335'}]}>{data.nameList}</Text>
                {values.map((valor, index) => (
                    <View style={[css.viewItem,{backgroundColor:'#F5B7B1',borderColor:'#FADBD8'}]} key={index}>
                        <View>
                            <View>
                                <Text style={css.valueList}>Valor: -{formattedValue(valor.value)}</Text>
                                <Text style={css.descricaoList}>Descrição: {valor.description}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={{ padding: 3, justifyContent: 'center' }} onPress={() => editItem(valor, data)}>
                                <Icon name="pencil" size={30} color="#000" />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ padding: 3, justifyContent: 'center' }} onPress={() => deleteItem(valor, data)}>
                                <Icon name="trash-can-outline" size={30} color="#000" />
                            </TouchableOpacity>
                        </View>
                    </View>))}
                <TouchableOpacity onPress={() => includeItem()}>
                    <Text style={[css.textIncludeItem,{backgroundColor:'#C0392B'}]}>INCLUIR NOVO ITEM</Text>
                </TouchableOpacity>
            </View >
        )
    }

    return (
        <View style={[css.container,{backgroundColor:'#FADBD8'}]}>
            <Text style={[css.titlePage,{backgroundColor:'#CB4335'}]}>VALORES À PAGAR/DEVENDO:</Text>
            <FlatList renderItem={({ item }) => <List data={item} values={item.info} />} data={list} keyExtractor={(item, index) => String(index)} />

            <Modal visible={modalAdd}>
                <SafeAreaView style={[css.containerModal,{backgroundColor:'#F5B7B1'}]}>
                    <ScrollView keyboardDismissMode={'on-drag'} contentContainerStyle={{ paddingBottom: 60 }}>
                        {modalInclude ? <Text style={css.titleModal}>INCLUIR NOVO ITEM:</Text> : <Text style={css.titleModal}>ADICIONAR NOVO ITEM:</Text>}
                        <TouchableOpacity style={css.buttonBack} onPress={backPage}>
                            <Icon name="arrow-left-bold" size={50} color="#000" />
                        </TouchableOpacity>
                        {modalInclude ? (
                            <View>
                                <Text style={[css.labelNameList,{backgroundColor:'#CB4335'}]}>Nome da Lista: </Text>
                                <TextInput editable={false} style={[css.inputNameList,{backgroundColor:'#EC7063', borderColor:'#CB4335'}]} placeholderTextColor="#000" onChangeText={text => setListName(text)} value={listName} />
                            </View>
                        ):(
                            <View>
                                <Text style={[css.labelNameList,{backgroundColor:'#CB4335'}]}>Nome da Lista: </Text>
                                <TextInput style={[css.inputNameList,{backgroundColor:'#EC7063', borderColor:'#CB4335'}]} placeholderTextColor="#000" onChangeText={text => setListName(text)} value={listName} />
                            </View>
                        )
                        }
                        <Text style={[css.labelValue,{backgroundColor:'#CB4335'}]}>Valor: </Text>
                        <CurrencyInput prefix="$" delimiter="." separator="," precision={2} style={[css.inputValue,{backgroundColor:'#EC7063', borderColor:'#CB4335'}]} placeholder="R$" placeholderTextColor="#000" onChangeValue={text => setMoney(text)} value={money} />
                        <Text style={[css.labelDescription,{backgroundColor:'#CB4335'}]}>Descrição: </Text>
                        <TextInput style={[css.inputDescription,{backgroundColor:'#EC7063', borderColor:'#CB4335'}]} onSubmitEditing={Keyboard.dismiss} multiline={true} placeholder='Descrição...' placeholderTextColor="#000" onChangeText={text => setDescription(text)} value={description} />
                    </ScrollView>
                    <TouchableOpacity style={[css.buttonAddItem,{backgroundColor:'#B03A2E'}]} onPress={addLucro}>
                        <Text style={css.textButtonAdd}>ADICIONAR</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </Modal>

            <Modal visible={modalEdit}>
                <SafeAreaView style={[css.containerModal,{backgroundColor:'#F5B7B1'}]}>
                    <ScrollView keyboardDismissMode={'on-drag'} contentContainerStyle={{ paddingBottom: 60 }}>
                        <Text style={css.titleModal}>EDITAR ITEM:</Text>
                        <TouchableOpacity style={css.buttonBack} onPress={backPage}>
                            <Icon name="arrow-left-bold" size={50} color="#000" />
                        </TouchableOpacity>
                        <Text style={[css.labelNameList,{backgroundColor:'#CB4335'}]}>Nome da Lista: </Text>
                        <TextInput style={[css.inputNameList,{backgroundColor:'#EC7063', borderColor:'#CB4335'}]} placeholderTextColor="#000" onChangeText={text => setListName(text)} value={listName} />
                        <Text style={[css.labelValue,{backgroundColor:'#CB4335'}]}>Valor: </Text>
                        <CurrencyInput prefix="$" delimiter="." separator="," precision={2} style={[css.inputValue,{backgroundColor:'#EC7063', borderColor:'#CB4335'}]} placeholder="R$" placeholderTextColor="#000" onChangeValue={text => setMoney(text)} value={money} />
                        <Text style={[css.labelDescription,{backgroundColor:'#CB4335'}]}>Descrição: </Text>
                        <TextInput style={[css.inputDescription,{backgroundColor:'#EC7063', borderColor:'#CB4335'}]} multiline={true} placeholder='Descrição...' placeholderTextColor="#000" onChangeText={text => setDescription(text)} value={description} />
                    </ScrollView>
                    <TouchableOpacity style={[css.buttonAddItem,{backgroundColor:'#B03A2E'}]} onPress={addEdit}>
                        <Text style={css.textButtonAdd}>EDITAR</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </Modal>
            <TouchableOpacity style={[css.buttonMore,{backgroundColor:'#943126'}]} onPress={() => setModalAdd(true)}>
                <Icon name="plus" size={50} color="#FFF" />
            </TouchableOpacity>
        </View >

    )
}