import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image
} from 'react-native';

import { colors } from '../../../styles';
import MapView, { Marker } from 'react-native-maps';
import { calculatePortraitDimension } from '../../../helpers';
import { changeLocation, refreshUsers, enableLocation } from '../../../actions/UserActions'
import { connect } from 'react-redux';
import { Button } from '../../../components';
import { getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const { width : deviceWidth, height : deviceHeight } = calculatePortraitDimension();
const LATITUDE_DELTA = 25;
const LONGITUDE_DELTA = LATITUDE_DELTA * (deviceWidth / deviceHeight);
delta = { 
  latitudeDelta : LATITUDE_DELTA, 
  longitudeDelta: LONGITUDE_DELTA
};
class RelocateView extends React.Component {
 
  constructor(props) {
    super(props);
    const { location } = this.props;
    let region = {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta : LATITUDE_DELTA, 
        longitudeDelta: LONGITUDE_DELTA
    }
    this.state = {
        region: region,
        delta: {
          latitudeDelta : LATITUDE_DELTA, 
          longitudeDelta: LONGITUDE_DELTA
        }
    }
  }   
  componentDidMount() {
  }

  getAddressComponent = (address) => {
    return <View style={{backgroundColor:'white', alignSelf:'stretch', height: 120}}>
        <View style={{flexDirection: 'column', flex:1, margin: 16}}>
            <Text style={styles.description}>{'Lokasi'}</Text>
            <Text style={[styles.text,{marginTop: 16, marginBottom:0}]}>{address}</Text>
        </View>
    </View>
  }

  onPressMap = (event) => {
    let region = {
        latitude: event.nativeEvent.coordinate.latitude,
        longitude: event.nativeEvent.coordinate.longitude,
        ...delta
    }
    this.setState({region})
  }

  onRelocate = () => {
    const body = {
      id: this.props.auth.user.id,
      latitude: this.state.region.latitude,
      longitude: this.state.region.longitude,
    };
    this.props.dispatch(changeLocation(body))
    this.props.dispatch(enableLocation(true));
    if(this.props.onRelocate) {
      this.props.onRelocate(this.state.region);
    }
  }
  renderBottomSecton = () => {
    return <View style={{height: 92, alignSelf:'stretch', justifyContent:'flex-end', marginHorizontal: 16}}>
        <Button
            secondary
            style={{ alignSelf: 'stretch', marginBottom: 8, marginTop:16, marignLeft :0, marginRight:0,  }}
            caption={'RELOCATE'}
            textColor={'white'}
            bgColor={colors.red}
            onPress={() => {
              this.onRelocate();
            }}
        />
        <Text style={[styles.description, {marginBottom:32, textAlign: 'center'}]}>By clicking <Text style={{fontSize:14, color:colors.red}}>Relocate</Text>, your home page will feature users near your new location</Text>
      </View>

  }
  renderTopSection = () => {
    return <View style={{height: 92, alignSelf:'stretch', justifyContent:'center', marginHorizontal: 16, marginTop: 16}}>
      <GooglePlacesAutocomplete
        placeholder='Search'
        minLength={2}
        autoFocus={false}
        returnKeyType={'search'}
        listViewDisplayed={false}
        fetchDetails={true}
        onPress={(data, details= null)=>{
          console.log('search result', details.geometry.location);
          this.setState({region: {
            longitude: details.geometry.location.lng,
            latitude: details.geometry.location.lat
          }})
        }}
        styles={{
          textInputContainer: {
            backgroundColor: 'transparent',
          },
          textInput: {
            marginLeft: 0,
            marginRight: 0,
            height: 38,
            color: '#5d5d5d',
            fontSize: 16
          },
          predefinedPlacesDescription: {
            color: '#1faadb'
          },
          listView : {
            backgroundColor: 'white'
          }
        }}
        query={{
          key:  'AIzaSyAWpoA39c_t1il3Hkmgg1lVDi0VW7cfY_4',
          language: 'en'
        }}
        nearByPlaceApi="GooglePlacesSearch"
        debounce={200}
      />
     
     </View>

  }

  renderCustomMarker = () => {
      return <Image style={styles.marker} source={require('../../../../assets/images/locate.png')} resizeMode='contain'/>
  }

  render() {
    const { region } = this.state;
    return (
        <View style={styles.container}> 
            <MapView
                ref={(ref) => {
                    this.map = ref;
                }}
                region={{...region}}
                style={styles.map}
                onPress={this.onPressMap}
                onRegionChange={(region) => {
                  delta = {
                    longitudeDelta : region.latitudeDelta * (deviceWidth / deviceHeight),
                    latitudeDelta: region.latitudeDelta
                  };
                }}
            >
                {
                    region && 
                    <MapView.Circle
                    key = { (region.latitude + region.longitude).toString() }
                    center = { this.state.region }
                    radius = { RADIUS }
                    strokeWidth = { 1 }
                    strokeColor = { colors.red }
              
                />
                }
              
                <Marker coordinate={region} >
                    {this.renderCustomMarker()}
                </Marker>


            </MapView>
            {this.renderTopSection()}
            {this.renderBottomSecton()}
        </View>

  
    );
  }
}

RADIUS = 250000;

const styles = StyleSheet.create({
  container: {
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent:'space-between',
     
    alignItems:'center'
  },

  map: {
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
  },
  marker: {
    width : 32,
    height: 32
  },
  description: {
    fontSize: 12,
    color: '#5f6060'
  }, 
  background: {
    flex: 1,
    backgroundColor: '#f4f4f4'
  },
  description: {
    fontSize: 17,
    color: colors.lightGray
  },

  text: {
    fontSize: 17,
    color: '#353535'
  },
});


const mapStateToProps = (state) => ({auth: state.auth });
  
export default connect(mapStateToProps)(RelocateView);