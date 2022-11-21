import * as React from 'react';
import { View, TouchableHighlight, TouchableOpacity, Text, ScrollView, SafeAreaView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useFocusEffect} from "@react-navigation/native"
import { Global_Styles } from './GlobalStyles';

function HomeStats({navigation}) {
  const [All_tables, Set_All_tables] = React.useState([]);
  const [Changer,Set_Changer] = React.useState(1);

  const Store_for_stats = async (index) => {
    try {
        const String_of_table = JSON.stringify(All_tables[index]);
        await AsyncStorage.setItem("Stats", String_of_table);
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
      if(String_Id == null){
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
      Get_All_Data();
    }, [])
  );

  var Map_of_tables = All_tables.map((Table, index) =>
  <View key={index} style={[Global_Styles.each_table, {display:Table["stats"] == "" ? 'none' : 'flex'}]}>
    <TouchableOpacity onPress={() => {Store_for_stats(index);navigation.navigate("Stats")}} style={[Global_Styles.names_each_table,{paddingRight:0}]}>
      <Text style={Global_Styles.text_each_table}>{Table["table_name"]}</Text>
    </TouchableOpacity>
  </View>
  );
  
  return (
    <SafeAreaView>
    <ScrollView>
    <View style={[Global_Styles.main_name]}>
      <Text style={{fontWeight:'600', fontSize:30}}>Stats</Text>
    </View>
    <View style={[Global_Styles.home_container, {marginTop:10}]}>
      {Map_of_tables}
    </View>
    </ScrollView>
    </SafeAreaView>
  );
}
export default HomeStats;