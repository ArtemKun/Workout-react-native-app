import * as React from 'react';
import { View, TouchableHighlight, TouchableOpacity, Text, ScrollView, SafeAreaView, Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useFocusEffect} from "@react-navigation/native"
import { Octicons } from '@expo/vector-icons';
import {LineChart} from "react-native-chart-kit";
import { Global_Styles } from './GlobalStyles';

function StatsScreen({navigation}) {

  const [Table, Set_Table] = React.useState({"table_name":"","table_title":[], "approach":[], "each_quantity":[[]], "use_task":true, "tasks":[], "stats":[]});
  
  const Get_Table_Data = async () => {
    try {
        const String_Table = await AsyncStorage.getItem("Stats");
        const Get_Table = JSON.parse(String_Table)
        if(String_Table !== null){
            Set_Table(prev => Get_Table);
        }
    } catch(e) {
        alert("Error_Save_Change_Add: "+e);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      Get_Table_Data();
    }, [])
  );

  var Map_of_stats = Table["stats"].map((mytab, index) =>
  <View key={index} style={[Global_Styles.each_table, {marginBottom:16}]}>
    <View style={[Global_Styles.stats_table]}>
      <Text style={Global_Styles.text_each_table}>{Table["table_title"][index]}</Text>
      <View style={[Global_Styles.miniline, {width:'90%'}]}/>
      <LineChart  data={{datasets:[{data: Table['stats'][index]}]}} width={Dimensions.get("window").width*0.80} height={240} yAxisInterval={10} chartConfig={{ backgroundGradientFrom:'#ECECEC', backgroundGradientTo:'#EEEEEE',decimalPlaces: 0, color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, propsForDots: { r: "0",} }} bezier style={{marginVertical: 8,borderRadius: 10,paddingTop:44, marginTop:-30}}/>
      <View style={{flexDirection:'row',  width:'100%', justifyContent:'flex-end', marginTop:10}}>
      <View style={{flexDirection:'column', position:'absolute', left:50}}>
        <Text style={{fontSize:20}}>First:</Text>
        <Text style={{fontSize:20, marginTop:8}}>Last:</Text>
        <Text style={{fontSize:20, marginTop:8}}>Summary:</Text>
      </View>
      <View style={{flexDirection:'column', marginRight:70, alignItems:'flex-end'}}>
        <Text style={{fontSize:20}}>{mytab[0]}</Text>
        <Text style={{fontSize:20, marginTop:8}}>{mytab[Table["stats"][index].length-1]}</Text>
        <Text style={{fontSize:20, marginTop:8}}>{mytab.reduce((Delete_Index,b) => Delete_Index+b,0)}</Text>
      </View>
      </View>
    </View>
  </View>
  );

  return (
  <SafeAreaView>
  <ScrollView>
  <View style={{alignItems:'center'}}>
    <View style={[Global_Styles.main_name, {marginBottom:20}]}>
      <TouchableHighlight underlayColor="none" onPress={() => { navigation.navigate("HomeStats")}} style={Global_Styles.main_arrow}>
        <Octicons name="arrow-left" size={38}/>
      </TouchableHighlight>
      <Text style={{fontWeight:'600', fontSize:30}}>{Table["table_name"]}</Text>
    </View>
    {Map_of_stats}
  </View>
  </ScrollView>
  </SafeAreaView>
  );
}
export default StatsScreen;