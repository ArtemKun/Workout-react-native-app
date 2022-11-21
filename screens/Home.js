import * as React from 'react';
import { View, TouchableHighlight, TouchableOpacity, Text, ScrollView, SafeAreaView} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AntDesign } from '@expo/vector-icons';
import {useFocusEffect} from "@react-navigation/native"
import { Global_Styles } from './GlobalStyles';

function HomeScreen({navigation}) {
  const [All_tables, Set_All_tables] = React.useState([]);
  const [Changer,Set_Changer] = React.useState(1);


  const Store_for_add = async (index) => {
    try {
      if(index !== -1){
        const String_of_tables = JSON.stringify(All_tables[index])
        await AsyncStorage.setItem("Change", String_of_tables)
        await AsyncStorage.setItem("Del", "del")
      }
        const String_of_tables = JSON.stringify(All_tables)
        await AsyncStorage.setItem("Top", String_of_tables);
        await AsyncStorage.setItem("Id", index+"")
    } catch (e) {
        alert("Error_Store_add: "+e);
    }
  }
  const Store_for_main = async (index) => {
    try {
        const String_of_tables = JSON.stringify(All_tables[index])
        await AsyncStorage.setItem("Main", String_of_tables)
        await AsyncStorage.setItem("Id", index+"")
    } catch (e) {
        alert("Error_Store_main: "+e);
    }
  }
  const Get_All_Data = async () => {
    try {
      const String_Add_Table = await AsyncStorage.getItem("Add");
      const String_of_tables = await AsyncStorage.getItem("Top");
      const String_Id = await AsyncStorage.getItem("Id");
      const Id = String_Id - "0";
      const Add_Table = JSON.parse(String_Add_Table);
      const Top = JSON.parse(String_of_tables);
      if(Id == -1){
        if(String_Add_Table !== null){
          Set_All_tables(prev => [...Top, Add_Table]);
          await AsyncStorage.setItem("Top", JSON.stringify([...Top,Add_Table]));
          Set_Changer(prev => Changer ^ 1);
        }
      }
      else if(String_Id == null){
        if(Top !== null){
          Set_All_tables(prev => Top);
          Set_Changer(prev => Changer ^ 1);
        }
      }
      else{
        if(String_Add_Table !== null){
          if(Add_Table["table_name"] == ""){
            Top.splice(Id,1);
            Set_All_tables(prev => Top);
            const Save_Top = JSON.stringify(Top)
            await AsyncStorage.setItem('Top', Save_Top);
            Set_Changer(prev => Changer ^ 1);
          }
          else{
            Top[Id] = Add_Table;
            Set_All_tables(prev => Top);
            const Save_Top = JSON.stringify(Top)
            await AsyncStorage.setItem('Top', Save_Top);
            Set_Changer(prev => Changer ^ 1);
          }
        }
      }
      await AsyncStorage.removeItem('Id');
      await AsyncStorage.removeItem('Add');
      await AsyncStorage.removeItem('Del');
      await AsyncStorage.removeItem('Change');
    } catch(e) {
        alert("Error_Get_All_Data: "+e);
    }
  }
  useFocusEffect(
    React.useCallback(() => {
      // Clear_All();
      Get_All_Data();
    }, [])
  );

  var Map_of_tables = All_tables.map((Table, index) =>
  <View key={index} style={Global_Styles.each_table}>
    <TouchableOpacity onPress={() => {Store_for_main(index); navigation.navigate("Main")}} style={Global_Styles.names_each_table}>
      <Text style={Global_Styles.text_each_table}>{Table["table_name"]}</Text>
    </TouchableOpacity>
    <TouchableHighlight onPress={() => {Store_for_add(index); navigation.navigate("Add")}} underlayColor="#CFCFCF" style={Global_Styles.home_options}>
        <AntDesign name="ellipsis1" size={40}/>
    </TouchableHighlight>
  </View>
  );
  
  return (
    <SafeAreaView>
    <ScrollView>
    <View style={[Global_Styles.home_container,{marginTop:0}]}>
    <StatusBar style="auto" />
      <View style={[Global_Styles.main_name, {marginBottom:10}]}>
        <Text style={{fontWeight:'600', fontSize:30}}>Home</Text>
      </View>
      {Map_of_tables}
      <View onTouchStart={() => {Store_for_add(-1); navigation.navigate('Add')}} style={Global_Styles.home_addbutton}>
        <View style={Global_Styles.home_plus1}/>
        <View style={Global_Styles.home_plus2}/>
      </View>
    </View>
    </ScrollView>
    </SafeAreaView>
  );
}
export default HomeScreen;