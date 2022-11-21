import * as React from 'react';
import { View, Text, TextInput, TouchableHighlight, SafeAreaView, ScrollView, TouchableOpacity, Alert} from 'react-native';
import {useFocusEffect} from "@react-navigation/native"
import { Octicons } from '@expo/vector-icons';
import Modal from 'react-native-modal'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Global_Styles } from './GlobalStyles';

function MainScreen({navigation}) {
  const [Table, Set_Table] = React.useState({"table_name":"","table_title":[], "approach":[], "each_quantity":[[]], "use_task":true, "tasks":[], "stats":[]});
  const [Visible_of_First_Modal, Set_Visible_of_First_Modal] = React.useState(false);
  const [Visible_of_Second_Modal, Set_Visible_of_Second_Modal] = React.useState(false);
  const [Visible_of_Third_Modal, Set_Visible_of_Third_Modal] = React.useState(false);
  const [Change_Tasks, Set_Change_Tasks] = React.useState(false);
  const [Number, Set_Number] = React.useState("");
  const [Title_index,Set_Title_index] = React.useState(0);
  const [Delete_Index,Set_Delete_Index] = React.useState();
  const [Changer,Set_Changer] = React.useState(1);

  const Third_Ok = () => {
    if(!Change_Tasks) Set_Visible_of_Third_Modal(prev=> false);
    Set_Change_Tasks(prev => false);
  }

  const New_Training = () => {
    for(let j = 0; j < Table['table_title'].length; j++){
      if(Table['stats'][j] == undefined){
        Table['stats'][j] = [Table['each_quantity'][j].reduce((Delete_Index,b) => Delete_Index+b,0)];      
      }
      else{
        Table['stats'][j][Table['stats'][j].length] = Table['each_quantity'][j].reduce((Delete_Index,b) => Delete_Index+b,0);   
      }
    }
    const q = Table;
    let mylength = Table["approach"].length;
    q["each_quantity"] = [[]];
    q["approach"] = [];
    for(let i = 0; i < mylength; i++){
      q["each_quantity"][i] = [0];
      q["approach"][i] = 0;
    }
    Set_Table(prev => q);
    Save_Table();
    Set_Changer(prev => !Changer);

  }
  const Save_Button = () =>{
    if(Number.length == 0){
        alert("Write number");
    }
    else{
      if(isNaN(parseInt(Number)) || parseInt(Number) == 0){
        alert('Try again');
      }
      else{
        if(Table["each_quantity"][Title_index][0] == 0){
          Table["each_quantity"][Title_index][0] = parseInt(Number);
        }
        else{
          Table["each_quantity"][Title_index][Table["each_quantity"][Title_index].length] = parseInt(Number);
        }
        Table["approach"][Title_index]++;
        Set_Visible_of_First_Modal(prev=> !Visible_of_First_Modal);
      }
      Set_Number(prev =>"");
      Save_Table();
      Set_Changer(prev => Changer ^ 1);
    }
  }
  const Save_Table = async () => {
    try {
        const String_Table = JSON.stringify(Table)
        await AsyncStorage.setItem('Add', String_Table)
    } catch (e) {
        alert("Error_Save_Main: "+e);
    }
  }
  const Add_Modal = (index) => {
    Set_Title_index(prev => index); 
    Set_Visible_of_First_Modal(prev => !Visible_of_First_Modal);
    Set_Changer(prev => Changer ^ 1);
  }
  const Remove_Modal = (index) => {
    if(Table["approach"][index] == 0){
      alert('There is no elements for deleting')
    }
    else{
      Set_Title_index(prev => index); 
      Set_Visible_of_Second_Modal(prev => !Visible_of_Second_Modal);
      Set_Changer(prev => Changer ^ 1);
    }
  }
  const Delete_element = ()=>{
    Table["each_quantity"][Title_index].splice(Delete_Index,1);
    Table["approach"][Title_index]--;
    Set_Visible_of_Second_Modal(prev => !Visible_of_Second_Modal);
    Set_Delete_Index(prev=> null);
    Save_Table();
    Set_Changer(prev => Changer ^ 1);
  };
  const Get_Table_Data = async () => {
    try {
      const String_Table = await AsyncStorage.getItem('Main')
      const Get_Table = JSON.parse(String_Table)
      if(String_Table !== null){
        if(Get_Table['use_task'] == true) Get_Table['use_task'] = true;
        else Get_Table['use_task'] = false;
        Set_Table(prev => Get_Table);
      }
    } catch(e) {
        alert("Error_Get_Main: "+e);
    }
  }
  useFocusEffect(
    React.useCallback(() => {
      Get_Table_Data();
    }, [])
  );  

  const Map_of_Title = Table["table_title"].map((Title, index) =>
  <View key={index} style={[Global_Styles.main_bigbar]}>
    <Text style={{fontSize:26,fontWeight:'500', paddingHorizontal:18, textAlign:'center'}}>{Title}</Text>
    <View style={Global_Styles.main_miniline}/>
    <View style={{flexDirection:'row',  width:'100%', justifyContent:'flex-end'}}>
      <View style={{flexDirection:'column', position:'absolute', left:40}}>
        <Text style={{fontSize:20}}>Approaches:</Text>
        <Text style={{fontSize:20, marginTop:8}}>Together:</Text>
      </View>
      <View style={{flexDirection:'column', marginRight:70, alignItems:'flex-end'}}>
        <Text style={{fontSize:20}}>{Table["approach"][index]}</Text>
        <Text style={{fontSize:20, marginTop:8}}>{Table["each_quantity"][index].reduce((Delete_Index,b) => Delete_Index+b,0)}</Text>
      </View>
    </View>
    <View style={{flexDirection:'row', marginTop:18}}>
      <TouchableHighlight style={Global_Styles.main_minus} underlayColor='#DEA2A3' onPress={() => Remove_Modal(index)}>
        <View style={Global_Styles.main_plus2}/>
      </TouchableHighlight>
      <TouchableHighlight style={Global_Styles.main_plus} underlayColor='#9EE79E' onPress={() => Add_Modal(index)}>
        <View style={Global_Styles.main_plus1}>
          <View style={Global_Styles.main_plus2}/>
        </View>        
      </TouchableHighlight>
    </View>
  </View>
  );

  const Map_of_Tasks = Table["table_title"].map((Title, index) =>
  <View key={index} style={[Global_Styles.main_bigbar,{width:290,flexDirection:'row',justifyContent:'center', padding:10, height:90}]}>
    <Text style={[Global_Styles.add_main_text,{width:180, marginLeft:-60, textAlign:'center'}]}>{Title}</Text>
    <View style={Global_Styles.vertical_line}/>
    <View style={{flexDirection:'column', alignItems:'center', justifyContent:'center', marginLeft:10, marginRight:-50, display: Change_Tasks ? "none" : "flex"}}>
      <Text style={{fontSize:20, flexWrap:'wrap', width:80}}>{Table["tasks"][index][0]}</Text>
      <Text style={{fontSize:20, flexWrap:'wrap', width:80}}>{Table["tasks"][index][1]}</Text>
    </View>
    <View style={{flexDirection:'column', alignItems:'center', justifyContent:'center', marginLeft:10, marginRight:-60, display: Change_Tasks ? "flex" : "none"}}>
      <TextInput style={Global_Styles.small_writename} placeholder='Approach' keyboardType='numeric' value={Table["tasks"][index][0]+""} onChangeText={(val) => {let q = Table; q["tasks"][index][0] = val; Set_Table(prev=> q); Save_Table(); Set_Changer(prev => Changer ^ 1)}}/>
      <TextInput style={Global_Styles.small_writename} placeholder='Quantity' keyboardType='numeric' value={Table["tasks"][index][1]+""} onChangeText={(val) => {let q = Table; q["tasks"][index][1] = val; Set_Table(prev=> q); Save_Table(); Set_Changer(prev => Changer ^ 1)}}/>
    </View>
  </View>
  );

  const Map_of_Delete_Items = Table["each_quantity"][Title_index].map((Title, index) =>
    <TouchableHighlight underlayColor='#CFCFCF' key={index} style={Global_Styles.maint_delete_items} onPress={() => Set_Delete_Index(prev => index)}>
      <Text style={{fontSize:20}}>{Title}</Text>
    </TouchableHighlight>
  );

  return (
    <SafeAreaView>
    <ScrollView showsVerticalScrollIndicator={false}>
    <Modal animationType='fade' onRequestClose={() => Set_Visible_of_First_Modal(prev=> false)} visible={Visible_of_First_Modal} style={Global_Styles.add_modal}>
        <View style={Global_Styles.modalView}>
            <View style={[Global_Styles.writebar, {marginTop:0, marginBottom:20}]}>
                <TextInput style={Global_Styles.writename} placeholder='Write number' keyboardType='numeric' value={Number} onChangeText={(val) => Set_Number(prev=>val)}/>
            </View>
            <View style={{flexDirection:'row'}}>
                <TouchableHighlight  underlayColor='#DEA2A3' style={Global_Styles.modal_cancel} onPress={() => {Set_Visible_of_First_Modal(prev=> !Visible_of_First_Modal); Set_Number(prev=>"")}}>
                    <Text style={Global_Styles.add_main_text}>Cancel</Text>
                </TouchableHighlight>
                <TouchableHighlight  underlayColor='#9EE79E' style={Global_Styles.modal_save} onPress={() => Save_Button()}>
                    <Text style={Global_Styles.add_main_text}>OK</Text>
                </TouchableHighlight>
            </View>
        </View>
    </Modal>
    <Modal animationType='fade' onRequestClose={() => Set_Visible_of_Second_Modal(prev=> false)} visible={Visible_of_Second_Modal} style={Global_Styles.add_modal}>
      <View style={[Global_Styles.modalView]}>
        <View style={{flexDirection:'row', flexWrap:'wrap', alignItems:'center', justifyContent:'center'}}>
          {Map_of_Delete_Items}
        </View>
        <View>
          <Text style={{fontSize:20, marginTop:10}}>{Table["each_quantity"][Title_index][Delete_Index]}</Text>
        </View>
        <View style={{flexDirection:'row', marginTop:20}}>
          <TouchableHighlight  underlayColor='#DEA2A3' style={Global_Styles.modal_cancel} onPress={() => {Set_Visible_of_Second_Modal(prev=> !Visible_of_Second_Modal); Set_Delete_Index(prev=> null)}}>
            <Text style={Global_Styles.add_main_text}>Cancel</Text>
          </TouchableHighlight>
          <TouchableHighlight  underlayColor='#9EE79E' style={Global_Styles.modal_save} onPress={() => Delete_element()}>
            <Text style={Global_Styles.add_main_text}>Delete</Text>
          </TouchableHighlight>
        </View>
      </View>
    </Modal>
    <Modal animationType='fade' onRequestClose={() => {Set_Visible_of_Third_Modal(prev=> false); Set_Change_Tasks(prev => false)}} visible={Visible_of_Third_Modal} style={[Global_Styles.add_modal]}>
    <View style={[Global_Styles.modalView,{backgroundColor:'#F1F1F1', width:'90%', marginTop:50}]}>
      <View style={{flexDirection:'column', width:'100%', paddingLeft:16}}>
        <Text style={[Global_Styles.add_main_text,{display: Change_Tasks ? "none" : "flex"}]}>Tasks</Text>
        <Text style={[Global_Styles.add_main_text,{display: Change_Tasks ? "flex" : "none"}]}>Change</Text>
        <View style={[Global_Styles.miniline, {alignSelf:'center', width:'90%'}]}/>
        <SafeAreaView style={{maxHeight:340, marginBottom:20, width:'100%'}}>
        <ScrollView showsVerticalScrollIndicator={true} >
          {Map_of_Tasks}
        </ScrollView>
        </SafeAreaView>
      </View>
      <View style={{flexDirection:'row', marginTop:-20}}>
        <TouchableHighlight  underlayColor='#DEA2A3' style={[Global_Styles.modal_cancel]} onPress={() => {Set_Change_Tasks(prev => !Change_Tasks)}}>
          <Text style={Global_Styles.add_main_text}>Change</Text>
        </TouchableHighlight>
        <TouchableHighlight  underlayColor='#9EE79E' style={[Global_Styles.modal_save]} onPress={() => {Third_Ok()}}>
          <Text style={Global_Styles.add_main_text}>Ok</Text>
        </TouchableHighlight>
      </View>
    </View>
    </Modal>
    <View style={[Global_Styles.main_name]}>
      <TouchableHighlight underlayColor="none" onPress={() => { navigation.navigate("Home")}} style={Global_Styles.main_arrow}>
        <Octicons name="arrow-left" size={38}/>
      </TouchableHighlight>
      <Text style={{fontWeight:'600', fontSize:30}}>{Table["table_name"]}</Text>
    </View>
    <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop:20, marginHorizontal:'10%'}}>
      <TouchableOpacity onPress={() => {Alert.alert("Details","Are you shure?",[{text:"No", onPress:()=> {}},{text:"Yes", onPress:()=> New_Training()}])}} style={Global_Styles.main_top_buttons}>
            <Text style={Global_Styles.main_top_text}>New training</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {Set_Visible_of_Third_Modal(prev => true)}} style={[Global_Styles.main_top_buttons ,{display: Table['use_task'] ? 'flex' : 'none',}]}>
            <Text style={Global_Styles.main_top_text}>Tasks</Text>
        </TouchableOpacity>
    </View>
    <View style={[Global_Styles.home_container,{marginTop:20}]}>
      {Map_of_Title}
    </View>
    </ScrollView>
    </SafeAreaView>
  );
}
export default MainScreen;