import * as React from 'react';
import { View, Text, TextInput, TouchableHighlight, SafeAreaView, ScrollView, Alert} from 'react-native';
import Modal from 'react-native-modal';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from "@react-navigation/native";
import { Global_Styles } from './GlobalStyles';
import { Switch } from 'react-native-switch';

function AddScreen({navigation}) {
    const [Table, Set_Table] = React.useState({"table_name":"","table_title":[], "approach":[], "each_quantity":[], "use_task":true, "tasks":[], "stats":[]});
    const [Title_Name, Set_Title_Name] = React.useState("");
    const [Visible_of_Modal, Set_Visible_of_Modal] = React.useState(false);
    const [Visible_of_Deletebutton, Set_Visible_of_Deletebutton] = React.useState(false);
    const [Changer,Set_Changer] = React.useState(1);

    const Delete_title = (index)=>{
        Table["table_title"].splice(index,1);
        Table["approach"].splice(index,1);
        Table["each_quantity"].splice(index,1);
        Table["tasks"].splice(index,1);
        Table["stats"].splice(index,1);
        Set_Changer(prev => Changer ^ 1);
    };
    const Save_Table = () =>{
        if(Table["table_name"].length == 0){
            Alert.alert("Details","Write name of table");
        }
        else if(Table["table_title"].length == 0){
            Alert.alert("Details","Write any work");
        }
        else{
            Store_Table_Data(); 
            navigation.navigate("Home");
        }
    }
    const Save_Title = () =>{
        if(Title_Name.length == 0){
            Alert.alert("Details","Write name of work");
        }
        else{
            Set_Visible_of_Modal(prev=> !Visible_of_Modal);
            Table["table_title"][Table["table_title"].length] = Title_Name; 
            Table["approach"][Table["approach"].length] = 0;
            Table["each_quantity"][Table["each_quantity"].length] = [0];
            Table["tasks"][Table["tasks"].length] = ["",""];
            Set_Title_Name(prev =>"");
        }
    }
    const Store_Table_Data = async () => {
        try {
            const String_Table = JSON.stringify(Table);
            await AsyncStorage.setItem("Add", String_Table);
        } catch (e) {
            alert("Error_Save_Add: "+e);
        }
    }
    const Get_Table_Data = async () => {
        try {
            const String_Table = await AsyncStorage.getItem("Change");
            const Delete = await AsyncStorage.getItem("Del");
            const Get_Table = JSON.parse(String_Table)
            if(String_Table !== null)
                Set_Table(prev => Get_Table);
            if(Delete !== null)
                Set_Visible_of_Deletebutton(prev => true);
          
        } catch(e) {
            alert("Error_Save_Change_Add: "+e);
        }
    }
    const Cancel_Add =  async () => {
        try {
            await AsyncStorage.removeItem('Add')
        } catch (e) {
            alert("err:1 "+e);
        }
    }
    const DeleteItem =  async () => {
        try{
            const Empty_Table = JSON.stringify({"table_name":"","table_title":[], "approach":[], "each_quantity":[], "use_task":true, "tasks":[], "stats":[]})
            await AsyncStorage.setItem('Add', Empty_Table)
            Set_Changer(prev => Changer ^ 1);
            navigation.navigate('Home');
        }
        catch(e){
            alert("err:1 "+e);
        }
      } 

    useFocusEffect(
        React.useCallback(() => {
          Get_Table_Data();
        }, [])
      );

      const Map_of_titles = Table["table_title"].map((Title, index) =>
      <View key={index} style={Global_Styles.each_title}>
          <Text style={Global_Styles.writename}>{Title}</Text>
          <TouchableHighlight onPress={()=> Delete_title(index)} underlayColor="#DEA2A3" style={Global_Styles.add_delete_element}>
              <Feather name="trash-2" size={32}/>
          </TouchableHighlight>
      </View>
      );
      return (
        <SafeAreaView>
        <ScrollView>
        <View style={Global_Styles.home_container}>
            <Modal animationType='fade' onRequestClose={() => {Set_Visible_of_Modal(prev=> !Visible_of_Modal); Set_Title_Name(prev => "")}} visible={Visible_of_Modal} style={Global_Styles.add_modal}>
                <View style={Global_Styles.modalView}>
                    <View style={[Global_Styles.writebar, {marginTop:0, marginBottom:20}]}>
                        <TextInput style={[Global_Styles.writename,{ width:'100%'}]} placeholder='Write name' value={Title_Name} onChangeText={(val) => Set_Title_Name(prev=>val)}/>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <TouchableHighlight  underlayColor='#DEA2A3' style={Global_Styles.modal_cancel} onPress={() => {Set_Visible_of_Modal(prev=> !Visible_of_Modal); Set_Title_Name(prev=>"")}}>
                            <Text style={Global_Styles.add_main_text}>Cancel</Text>
                        </TouchableHighlight>
                        <TouchableHighlight  underlayColor='#9EE79E' style={Global_Styles.modal_save} onPress={Save_Title}>
                            <Text style={Global_Styles.add_main_text}>OK</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
            <View style={Global_Styles.writebar}>
                <TextInput style={[Global_Styles.add_main_text,{width:'100%', height:'80%'}]} placeholder='Write name' value={Table["table_name"]} onChangeText={(val) => {let ak = val; Set_Table(prev => ({"table_name":ak,"table_title":Table["table_title"], "approach":Table["approach"],"each_quantity":Table["each_quantity"], "use_task": Table["use_task"], "tasks":Table["tasks"], "stats":[]}))}}/>
            </View>
            <View style={Global_Styles.add_bigbar}>
                <Text style={Global_Styles.add_main_text}>Work</Text>
                <View style={{backgroundColor:"#F2F2F2", width:"90%", alignItems: 'center',justifyContent: 'center',borderRadius:20, paddingVertical:10, marginTop:10}}>
                    {Map_of_titles}
                </View>
                <TouchableHighlight style={Global_Styles.add_add_new_element} underlayColor='#9EE79E' onPress={() => Set_Visible_of_Modal(prev=> !Visible_of_Modal)}>
                    <View style={Global_Styles.add_plus1}>
                        <View style={Global_Styles.add_plus2}/>
                    </View>
                </TouchableHighlight>
            </View>
            <View style={Global_Styles.add_bigbar}>
                <View style={{flexDirection:'row'}}>
                    <Text style={[Global_Styles.add_main_text,{marginRight:80}]}>Use tasks</Text>
                    <Switch value={Table['use_task']} onValueChange={() => Set_Table(prev => ({"table_name":Table['table_name'],"table_title":Table["table_title"], "approach":Table["approach"],"each_quantity":Table["each_quantity"], "use_task": !Table["use_task"], "tasks":Table["tasks"], "stats":[]}))} activeText={""} inActiveText={""} backgroundActive={'#ADF6AC'} backgroundInactive={'#F1AEAF'} circleBorderWidth={0} circleActiveColor={"#7ACC78"} circleInActiveColor={"#D78082"}/>
                </View>
            </View>
            <TouchableHighlight style={[Global_Styles.add_delete_table,{display: Visible_of_Deletebutton ? 'flex' : 'none'}]} underlayColor='#DEA2A3' onPress={() =>{Alert.alert("Details","Are you shure?",[{text:"No", onPress:()=> {}},{text:"Yes", onPress:()=> DeleteItem()}])}}>
                <Text style={Global_Styles.add_main_text}>Delete table</Text>
            </TouchableHighlight>
            <View style={{flexDirection:'row' }}>
                <TouchableHighlight style={Global_Styles.add_cancel} underlayColor='#DEA2A3' onPress={() =>{Cancel_Add(); navigation.navigate('Home')}}>
                    <Text style={Global_Styles.add_main_text}>Cancel</Text>
                </TouchableHighlight>
                <TouchableHighlight style={Global_Styles.add_save} underlayColor='#9EE79E' onPress={() => {Save_Table()}}>
                    <Text style={Global_Styles.add_main_text}>Save</Text>
                </TouchableHighlight>
            </View>
        </View>
        </ScrollView>
        </SafeAreaView>
      );
    }
export default AddScreen;