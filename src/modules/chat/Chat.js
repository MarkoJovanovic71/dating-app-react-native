import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform
} from 'react-native';

import { getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper';
import { connect } from 'react-redux';

class Chat extends React.Component {
  constructor(props) {
    super(props);
  }
  getAddGroupButton = () => {
    return <View style={{ position:'absolute', top: 16, right: 16, alignItems: 'center', justifyContent:'center'}}>
      <TouchableOpacity>
        <Text style={{fontSize: 17, color: 'white'}}>Add Group</Text>
      </TouchableOpacity>
    </View>
  }

  render() {
    return (
      <View style={styles.background}>
          <View style={styles.container}>
          {this.getAddGroupButton()}
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'ios' ? getStatusBarHeight(true) : 0,
  },
  background:{
    flex: 1,
    backgroundColor:'black'
  },

  
  text: {
    fontSize: 14,
    color: 'white'
  }
});

const mapStateToProps = (state) => ({ app: state.app });

export default connect(mapStateToProps)(Chat);