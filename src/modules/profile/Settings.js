import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  Platform,
  TouchableOpacity,
  ScrollView
} from 'react-native';


import { connect } from 'react-redux';

import { calculatePortraitDimension, showAlert } from '../../helpers';
import { getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper';
import { TopNavigatorView, LoadingOverlay, ImageView } from '../../components';
import ListItem from './components/ListItem';
import SectionTitleItem from './components/SectionTitleItem';
import ListItemSwitch from './components/ListItemSwitch';
import NumberPickerListItem from './components/NumberPickerListItem';
import ItemPickerListItem from './components/ItemPickerListItem';
import DatePickerListItem from './components/DatePickerListItem';
import {unitSystems} from '../../config';


import PhotosPanel from './components/PhotosPanel';
import { uploadProfileImage, updateProfile ,updateSettings , logout } from '../../actions/AuthActions'
import * as ACTION_TYPES from '../../actions/ActionTypes'
import { colors } from '../../styles';


const { height : deviceHeight, width: deviceWidth } = calculatePortraitDimension();

class Settings extends React.Component {
    constructor(props) {
      super(props);
      let settings = props.navigation.getParam('settings');
      let user = props.navigation.getParam('user');
      this.state = {
        ...user,
        ...settings  
      }
    }

    componentWillReceiveProps(nextProps) {
      if(this.props.auth.error != nextProps.auth.error && nextProps.auth.error && nextProps.auth.currentAction == ACTION_TYPES.UPDATE_PROFILE_FAILURE) {
        showAlert("Whoops", nextProps.auth.error);
      } 
    } 


    updateProfile = () => {
      const { user } = this.props.auth;
      const { username, age, about, height, weight, role, bodyType,
        sexualStatus, place, hivStatus, lastTestDate } = user;
      const { incognito, showDistance, isIncognito, allowsAllComments } = this.state;
      let body = {
          username,
          age, 
          about, 
          height,
          weight,
          role,
          bodyTypeId: bodyType.id,
          sexualStatusId: sexualStatus.id,
          place,
          hivStatusId: hivStatus.id,
          lastTestDate,
          incognito,
          showDistance,
          isIncognito,
          approveAllComments: allowsAllComments? "true" : "false"
      }
      console.log("updateProfile", body)
      this.props.dispatch(updateProfile(user.id, body));
    }

    saveSettings = () => {
      const { chatNotifications, unitSystem, lockCode, lockCodePassword }  = this.state;
      let settings = {
        chatNotifications,
        unitSystem,
        lockCode,
        lockCodePassword
      }
      this.props.dispatch(updateSettings(settings))
    }

    changeEmail = (email) => {

    }
    changePassword = (password) => {

    }

    getProfileHeader = ( imageUrl, name) => {
        return <View style={{height: 200, alignSelf:'stretch', 
                      borderTopColor:colors.darkGray, 
                      borderBottomColor:colors.darkGray, 
                      borderTopWidth: 0.5, 
                      borderBottomWidth: 0.5, 
                      justifyContent:'center',alignItems:'center' }}>
              <ImageView 
                style={{width: 120, height: 120, borderRadius: 60, borderWidth:3, borderColor: colors.white}}
                shortUrl={imageUrl}
                defaultImage={require('../../../assets/images/defaultImage.png')}
              />
              <Text style={{color:colors.white, fontSize: 22, fontWeight: 'bold', marginTop:16}}> {name} </Text>
        </View>
    }

    getPhotoSection = ( items ) => {
      if(items.length == 0 ||  (items.length >0 && !(items[0].isAddButton))) {
        items.unshift({isAddButton:true})
      }

      return <PhotosPanel
        items={items}
        onAddPressed={()=>{
          this.props.navigation.navigate("GalleryEdit");
        }}
        onImagePressed={(item)=>{
          console.log(item);
        }}
        showType={'horizontal'}
        navigation={this.props.navigation}
      />
    }
    getSaveButton = () => {
      return <TouchableOpacity 
      onPress={()=>{
        this.onSave();
      }}>
        <View style={{paddingRight: 16, height: 50, justifyContent:'center', alignItems:'center'}} >
           <Text style={{fontSize: 17, color: 'white', fontWeight: 'bold'}}>Save</Text>
        </View>
     
      </TouchableOpacity>
    }
    getTopNavigator = () => {
      return <TopNavigatorView
        title={'Profile Edit'}
        onBackPressed = {() => {
          this.props.navigation.goBack();
        }}
      />
    }


    onUpdateImage = (userId, image) => {
      this.props.dispatch(uploadProfileImage(userId, image));
    } 
    render() {
        const { user, gallery } = this.props.auth;

        const { modifiables } = this.props.app;
        return (
            <View style={styles.background}>
              <LoadingOverlay visible={this.props.auth.isLoading}/>
              <View style={styles.container}>
              <ScrollView>
                <View style={styles.contentContainer}>
                  {this.getProfileHeader(user.smallImageUrl, user.username)}
                  <SectionTitleItem
                    itemContainerStyle={{marginTop:32}}
                    title={'PRIVACY'}
                  />
                  <ListItemSwitch
                    title={'Incognito'}
                    rightIconImageOn={require('../../../assets/images/boneoncb.png')}
                    rightIconImageOff={require('../../../assets/images/boneoffcb.png')}
                    value={this.state.isIncognito}
                    onChangeState={(value)=>{
                      this.setState({isIncognito: value}, ()=>{
                        this.updateProfile()
                      })

                    }}
                  />
                  <ListItemSwitch
                    title={'Show Distance'}
                    rightIconImageOn={require('../../../assets/images/boneoncb.png')}
                    rightIconImageOff={require('../../../assets/images/boneoffcb.png')}
                    value={this.state.showDistance}
                    onChangeState={(value)=>{
                      this.setState({showDistance: value}, ()=>{
                        this.updateProfile()
                      })
                      
                    }}
                  />
                  <ListItemSwitch
                    title={'Incomming Calls'}
                    rightIconImageOn={require('../../../assets/images/boneoncb.png')}
                    rightIconImageOff={require('../../../assets/images/boneoffcb.png')}
                    value={this.state.incomingCalls}
                    onChangeState={(value)=>{
                      this.setState({incomingCalls: value}, ()=>{
                        this.updateProfile();
                      })
                    }}
                  />
                  <SectionTitleItem
                    itemContainerStyle={{marginTop:32}}
                    title={'CHAT'}
                  />
                  <ListItemSwitch
                    title={'Chat Notifications'}
                    rightIconImageOn={require('../../../assets/images/boneoncb.png')}
                    rightIconImageOff={require('../../../assets/images/boneoffcb.png')}
                    value={this.state.chatNotifications}
                    onChangeState={(value)=>{
                      this.setState({chatNotifications: value}, ()=>{
                        this.saveSettings();
                      })
                    }}
                  />
                  <ListItem
                    title={'Clear All Chats'}
                    itemContainerStyle={{ justifyContent:'center', alignItems:'center'}}
                    onItemPress={()=>{

                    }}
                  />
              
                  <ItemPickerListItem
                    title={'Unit System'}
                    items={unitSystems}
                    value={this.state.unitSystem ? this.state.unitSystem.name : 'Metric'}
                    onPickItem={(item)=> {
                      this.setState({unitSystem: item}, ()=>{
                        this.saveSettings();
                      })
                    }}
                  />
                  <ListItemSwitch
                    title={'Lock Code'}
                    rightIconImageOn={require('../../../assets/images/boneoncb.png')}
                    rightIconImageOff={require('../../../assets/images/boneoffcb.png')}
                    value={this.state.lockCode}
                    onChangeState={(value)=>{
                      this.setState({lockCode: value}, () => {
                        this.saveSettings();
                      })
                    }}
                  />

                  <SectionTitleItem
                    itemContainerStyle={{marginTop:32}}
                    title={'ACCOUNT'}
                  />
                  
                  <ListItem
                    title={'Change Email'}
                    rightIconImage={require('../../../assets/images/forward.png')}
                    onItemPress={()=>{
                      this.props.navigation.navigate("ChangeEmail", { value: this.state.email, returnData: (value) => {
                        this.setState({email: value});
                      }})
                    }}
                  />
                  <ListItem
                    title={'Change Password'}
                    rightIconImage={require('../../../assets/images/forward.png')}
                    onItemPress={()=>{
                      this.props.navigation.navigate("ChangePassword", { value: ''})
                    }}
                  />

                  <SectionTitleItem
                    itemContainerStyle={{marginTop:32}}
                    title={'ABOUT'}
                  />
                  <ListItem
                    title={'Support'}
                    rightIconImage={require('../../../assets/images/forward.png')}
                    onItemPress={()=>{

                    }}
                  />
                  <ListItem
                    title={'Profile Guidelines'}
                    rightIconImage={require('../../../assets/images/forward.png')}
                    onItemPress={()=>{

                    }}
                  />
                  <ListItem
                    title={'Terms of Service'}
                    rightIconImage={require('../../../assets/images/forward.png')}
                    onItemPress={()=>{

                    }}
                  />


                  <ListItem
                    title={'Privacy Policy'}
                    rightIconImage={require('../../../assets/images/forward.png')}
                    onItemPress={()=>{

                    }}
                  />
                  <SectionTitleItem
                    itemContainerStyle={{marginTop:32}}
                    title={'BLOCKING'}
                  />
                  <ListItem
                    title={'Block List'}
                    rightIconImage={require('../../../assets/images/forward.png')}
                    onItemPress={()=>{
                      this.props.navigation.navigate("BlockingList");
                    }}
                  />

                  <ListItem
                    title={'Unblock All'}
                    itemContainerStyle={{ justifyContent:'center', alignItems:'center'}}
                    onItemPress={()=>{

                    }}
                  />

                  <SectionTitleItem
                    itemContainerStyle={{marginTop:32}}
                    title={'COMMENT'}
                  />
                  <ListItemSwitch
                    title={'Approve All Comments'}
                    rightIconImageOn={require('../../../assets/images/boneoncb.png')}
                    rightIconImageOff={require('../../../assets/images/boneoffcb.png')}
                    value={this.state.allowsAllComments}
                    onChangeState={(value)=>{
                      this.setState({allowsAllComments: value}, ()=>{
                        this.updateProfile();
                      })
                    }}
                  />

                  <SectionTitleItem
                    itemContainerStyle={{marginTop:32}}
                    title={'RESET'}
                  />
                  <ListItem
                    title={'Deactivate Account'}
                    itemContainerStyle={{ justifyContent:'center', alignItems:'center'}}
                    onItemPress={()=>{

                    }}
                  />
                  <ListItem
                    title={'Delete Profile'}
                    itemContainerStyle={{ justifyContent:'center', alignItems:'center'}}
                    onItemPress={()=>{

                    }}
                  />
                  <ListItem
                    title={'Log Out'}
                    itemContainerStyle={{ justifyContent:'center', alignItems:'center'}}
                    onItemPress={()=>{
                      this.props.dispatch(logout())
                    }}
                  />

                </View>
              </ScrollView>
              </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex:1,
        backgroundColor: 'black'
    },
    contentContainer: {
      flex: 1
    },  
    container: {
        flex: 1,
        marginBottom: getBottomSpace(),
        marginTop: Platform.OS === 'ios' ? getStatusBarHeight(true) : 0,
    },
    spliter: {
      alignSelf:'stretch',
      height: 0.5,
      backgroundColor: colors.darkGray,

    }

});

const mapStateToProps = (state) => ({ app: state.app, auth: state.auth, gallery: state.gallery });

export default connect(mapStateToProps)(Settings);