import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import Camera from './components/camera/camera.component';

import {StackNavigator} from 'react-navigation';

class App extends React.Component {

  static navigationOptions = {
    title: "Home",
    header: ({state}) => ({
      style: {
        backgroundColor: '#f9f9f9'
      },
      right: (
        <Button title="New" onPress={() => state.params.handleNew()}></Button>
      )
    })
  }

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {

    this.props.navigation.setParams({ handleNew: this.onNew.bind(this) });
  }

  onNew () {

    this.setState({
      shouldShowCamera: true
    })
  }

  onTakePhotoSuccess (data) {

    console.log('camera data -> ', data);

    this.setState({
      shouldShowCamera: false,
    });
  }

  onCameraError () {

    this.setState({
      shouldShowCamera: false,
    });
  }

  onCameraCancel () {

    this.setState({
      shouldShowCamera: false,
    });
  }


  render() {

    const {shouldShowCamera} = this.state;

    return (
      <View style={styles.container}>
        {shouldShowCamera ?
        <Camera
          typeButton={false}
          visible={ true }
          onCancel={this.onCameraCancel.bind(this)}
          onError={this.onCameraError.bind(this)}
          onTakePhoto={this.onTakePhotoSuccess.bind(this)} />
        : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const Stack = StackNavigator({
  Home: {
    screen: App,
  },
}, {
  headerMode: 'screen',
  cardStyle: {
    backgroundColor: '#cccccc'
  },
  navigationOptions: {
    header: {
      backTitle: null
    }
  }
});

export default Stack;