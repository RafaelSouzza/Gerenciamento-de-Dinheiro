import React, { useState, useEffect, createRef } from 'react';
import { View, Text, Alert, FlatList, Keyboard, ScrollView, SafeAreaView, TouchableOpacity, Modal } from 'react-native';
import { formatNumber } from 'react-native-currency-input';
import CurrencyInput from 'react-native-currency-input';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import css from '../styles/css';
import { useMoney } from '../context/Money';
import TextInputMask from 'react-native-text-input-mask';
import { MaskedTextInput } from 'react-native-mask-text';

import { TextInput } from 'react-native-paper'

let valueEdit;
let valueItemData;

export default function Account() {

    const ref1 = createRef()

    const [modalAdd, setModalAdd] = useState(false)
    const [list, setList] = useState([])
    const [money, setMoney] = useState('')
    const [listName, setListName] = useState('')
    const [description, setDescription] = useState('')
    const [key, setKey] = useState(1)
    const [active, setActive] = useState(0)
    const [modalEdit, setModalEdit] = useState(false)
    const [modalInclude, setModalInclude] = useState(false)
    const [portion, setPortion] = useState('1')
    const [eachPortion, setEachPortion] = useState('')

    const [search, setSearch] = useState('')

    const { setLucro } = useMoney()

    useEffect(async () => {
        const getlist = await AsyncStorage.getItem('@lucros')
        const getKey = await AsyncStorage.getItem('@keysLucro')
        if (getlist && getKey) {
            setList(JSON.parse(getlist))
            setKey(JSON.parse(getKey))
        }
    }, [])

    useEffect(() => {
        async function store() {
            await AsyncStorage.setItem('@lucros', JSON.stringify(list))
            await AsyncStorage.setItem('@keysLucro', JSON.stringify(key))
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
            let somaFinal = []
            list.map((result) => {
                let valor = result.info
                valor.map((values) => somaFinal.push(values.value))
            })
            somaFinal = somaFinal.reduce((value1, value2) => value1 + value2)
            setLucro(somaFinal)
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
                <Text style={css.titleName}>{data.nameList}</Text>
                {values.map((valor, index) => (
                    <View style={css.viewItem} key={index}>
                        <View>
                            <View>
                                <Text style={css.valueList}>Valor: +{formattedValue(valor.value)}</Text>
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
                    <Text style={css.textIncludeItem}>INCLUIR NOVO ITEM</Text>
                </TouchableOpacity>
            </View >
        )
    }

    return (
        <View style={css.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>
                <TextInput style={css.inputSearch} placeholder='Pesquisar' placeholderTextColor='#000' onChangeText={(text) => setSearch(text)} value={search} />
                <TouchableOpacity style={css.buttonSearch}>
                    <Icon name="magnify" size={45} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity style={css.buttonCategory}>
                    <Icon name="cog-outline" size={45} color="#FFF" />
                </TouchableOpacity>
            </View>
            <FlatList renderItem={({ item }) => <List data={item} values={item.info} />} data={list} keyExtractor={(item, index) => String(index)} />

            <Modal visible={modalAdd}>
                <SafeAreaView style={css.containerModal}>
                    <ScrollView keyboardDismissMode={'on-drag'} contentContainerStyle={{ paddingBottom: 60 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 15, alignItems: 'center' }}>
                            <TouchableOpacity onPress={backPage}>
                                <Icon name="arrow-left-bold" size={50} color="#000" />
                            </TouchableOpacity>
                            {modalInclude ? <Text style={css.titleModal}>INCLUIR NOVO ITEM:</Text> : <Text style={css.titleModal}>ADICIONAR NOVO ITEM:</Text>}
                        </View>
                        {modalInclude ? <TextInput editable={false} style={css.inputModal} placeholderTextColor="#000" onChangeText={text => setListName(text)} value={listName} /> : <TextInput mode='outlined' style={{ alignSelf: 'center', width: "90%" }} theme={{ colors: { primary: '#5DADE2', underlineColor: 'transparent', background: "#D6EAF8" }, }} outlineColor='#5DADE2' label='Nome da Lista:' placeholderTextColor="#000" onChangeText={text => setListName(text)} value={listName} />}
                        <TextInput
                            keyboardType='numeric'
                            label='Valor:'
                            style={{ alignSelf: 'center', width: "90%" }}
                            mode='outlined'
                            theme={{ colors: { primary: '#5DADE2', underlineColor: 'transparent', background: "#D6EAF8" } }}
                            outlineColor="#5DADE2"
                            placeholderTextColor="#000"
                            render={(props) => (
                                <MaskedTextInput
                                    {...props}
                                    type="currency"
                                    value={money}
    
                                    options={{
                                        prefix: 'R$',
                                        decimalSeparator: ',',
                                        groupSeparator: '.',
                                        precision: 2
                                    }}
                                    onChangeText={(text) => {
                                        props.onChangeText?.(text)
                                        setMoney(text)
                                    }}

                                />
                            )}
                        />
                        <TextInput style={{ alignSelf: 'center', width: "90%" }} mode='outlined' theme={{ colors: { primary: '#5DADE2', underlineColor: 'transparent', background: "#D6EAF8" } }} outlineColor="#5DADE2" onSubmitEditing={Keyboard.dismiss} multiline={true} label="Descrição:" placeholder='Escreva aqui...' placeholderTextColor="#000" onChangeText={text => setDescription(text)} value={description} />
                        <View style={{ flexDirection: 'row', justifyContent: "space-between", width: "90%", alignSelf: 'center' }}>
                            <View style={{ width: "45%" }}>
                                <TextInput mode='outlined' theme={{ colors: { primary: '#5DADE2', underlineColor: 'transparent', background: "#D6EAF8" } }} outlineColor="#5DADE2" editable={(money !== '')} label="Nº de Parcelas:" keyboardType='numeric' placeholderTextColor="#000" onChangeText={text => setPortion(text)} value={portion} />
                            </View>
                            <View style={{ width: "45%" }}>
                                <TextInput mode='outlined' label={eachPortion} editable={false} theme={{ colors: { primary: '#5DADE2', underlineColor: 'transparent', background: "#D6EAF8" } }} outlineColor="#5DADE2" />
                            </View>
                        </View>
                    </ScrollView>
                    <TouchableOpacity style={css.buttonAddItem} onPress={addLucro}>
                        <Text style={css.textButtonAdd}>ADICIONAR</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </Modal>

            <Modal visible={modalEdit}>
                <SafeAreaView style={css.containerModal}>
                    <ScrollView keyboardDismissMode={'on-drag'} contentContainerStyle={{ paddingBottom: 60 }}>
                        <Text style={css.titleModal}>EDITAR ITEM:</Text>
                        <TouchableOpacity style={css.buttonBack} onPress={backPage}>
                            <Icon name="arrow-left-bold" size={50} color="#000" />
                        </TouchableOpacity>
                        <Text style={css.labelNameList}>Nome da Lista: </Text>
                        <TextInput style={css.inputNameList} placeholderTextColor="#000" onChangeText={text => setListName(text)} value={listName} />
                        <Text style={css.labelValue}>Valor: </Text>
                        <CurrencyInput prefix="$" delimiter="." separator="," precision={2} style={css.inputValue} placeholder="R$" placeholderTextColor="#000" onChangeValue={text => setMoney(text)} value={money} />
                        <Text style={css.labelDescription}>Descrição: </Text>
                        <TextInput style={css.inputDescription} multiline={true} placeholder='Descrição...' placeholderTextColor="#000" onChangeText={text => setDescription(text)} value={description} />
                    </ScrollView>
                    <TouchableOpacity style={css.buttonAddItem} onPress={addEdit}>
                        <Text style={css.textButtonAdd}>EDITAR</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </Modal>
            <TouchableOpacity style={css.buttonMore} onPress={() => setModalAdd(true)}>
                <Icon name="plus" size={50} color="#FFF" />
            </TouchableOpacity>
        </View>

    )
}
