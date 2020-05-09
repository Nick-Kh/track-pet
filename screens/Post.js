import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ImagePicker, Location, Permissions } from 'expo';
import { NavigationEvents } from 'react-navigation';
import {
  updateDescription,
  updateLocation,
  uploadPost,
  updatePostPhoto,
  updatePet,
  updatePetRace
} from '../actions/post';
import {
  Button,
  FlatList,
  Modal,
  SafeAreaView,
  Text,
  View,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity
} from 'react-native';
const GOOGLE_API =
  'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
import { uploadPhoto } from '../actions';
import { Dropdown } from 'react-native-material-dropdown';

// Location API: 'AIzaSyDU5h-RUJQy6Zq62wX8JFQyF5r5i94jtLc'
// Image Recognition API: AIzaSyBVWMUzIzwJTjJyyOvwE4z06Sf7vR_LEBA

import styles from '../styles.js';

class Post extends React.Component {
  state = {
    showModal: false,
    locations: [],
    image: null,
    uploading: false,
    googleResponse: null
  };

  componentDidMount() {
    this.getLocations();
  }

  post = () => {
    this.props.uploadPost();
    this.props.navigation.navigate('Home');
  };

  onWillFocus = () => {
    if (!this.props.post.photo) {
      this.openLibrary();
    }
  };

  openLibrary = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === 'granted') {
      const image = await ImagePicker.launchImageLibraryAsync();
      if (!image.cancelled) {
        const url = await this.props.uploadPhoto(image);
        this.props.updatePostPhoto(url);
      }
    }
  };

  setLocation = location => {
    const place = {
      name: location.name,
      coords: {
        lat: location.geometry.location.lat,
        lng: location.geometry.location.lng
      }
    };
    this.setState({ showModal: false });
    this.props.updateLocation(place);
  };

  getLocations = async () => {
    const permission = await Permissions.askAsync(Permissions.LOCATION);
    if (permission.status === 'granted') {
      const location = await Location.getCurrentPositionAsync();
      const url = `${GOOGLE_API}?location=${location.coords.latitude},${
        location.coords.longitude
      }&rankby=distance&key=${'AIzaSyDU5h-RUJQy6Zq62wX8JFQyF5r5i94jtLc'}`;
      const response = await fetch(url);
      const data = await response.json();
      this.setState({ locations: data.results });
    }
  };

  submitToGoogle = async () => {
    try {
      this.setState({ uploading: true });
      let { image } = this.state;
      let body = JSON.stringify({
        requests: [
          {
            features: [
              { type: 'LABEL_DETECTION', maxResults: 10 },
              { type: 'LANDMARK_DETECTION', maxResults: 5 },
              { type: 'FACE_DETECTION', maxResults: 5 },
              { type: 'LOGO_DETECTION', maxResults: 5 },
              { type: 'TEXT_DETECTION', maxResults: 5 },
              { type: 'DOCUMENT_TEXT_DETECTION', maxResults: 5 },
              { type: 'SAFE_SEARCH_DETECTION', maxResults: 5 },
              { type: 'IMAGE_PROPERTIES', maxResults: 5 },
              { type: 'CROP_HINTS', maxResults: 5 },
              { type: 'WEB_DETECTION', maxResults: 5 }
            ],
            image: {
              source: {
                imageUri: this.props.post.photo
              }
            }
          }
        ]
      });
      let response = await fetch(
        'https://vision.googleapis.com/v1/images:annotate?key=' +
          'AIzaSyBVWMUzIzwJTjJyyOvwE4z06Sf7vR_LEBA',
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: body
        }
      );
      let responseJson = await response.json();
      console.log(responseJson);
      this.setState({
        googleResponse: responseJson,
        uploading: false
      });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    let petsKind = [
      {
        value: 'Cat'
      },
      {
        value: 'Dog'
      }
    ];

    let petsRace = [
      {
        value: 'Golden Retriver'
      },
      {
        value: 'Labrador'
      },
      {
        value: 'Akita'
      },
      {
        value: 'German Shepherd'
      },
      {
        value: 'Boxer'
      },
      {
        value: 'Asian'
      },
      {
        value: 'British Shorthair'
      },
      {
        value: 'Persian'
      }
    ];
    return (
      <ScrollView contentContainerStyle={[styles.container, styles.center]}>
        <NavigationEvents onWillFocus={this.onWillFocus} />
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.state.showModal}
        >
          <SafeAreaView style={[styles.container, styles.center]}>
            <FlatList
              keyExtractor={item => item.id}
              data={this.state.locations}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.border}
                  onPress={() => this.setLocation(item)}
                >
                  <Text style={styles.gray}>{item.name}</Text>
                  <Text style={styles.gray}>{item.vicinity}</Text>
                </TouchableOpacity>
              )}
            />
          </SafeAreaView>
        </Modal>

        <Image
          style={styles.postPhoto}
          source={{ uri: this.props.post.photo }}
        />
        <View style={{ flexDirection: 'row' }}>
          <Dropdown
            containerStyle={{
              width: '25%',
              margin: 10,
              padding: 15,
              borderColor: '#d3d3d3'
            }}
            label='Kind'
            data={petsKind}
            onChangeText={text => this.props.updatePet(text)}
          />
          <Dropdown
            containerStyle={{
              width: '40%',
              margin: 10,
              padding: 15,
              borderColor: '#d3d3d3'
            }}
            label='Race'
            data={petsRace}
            onChangeText={text => this.props.updatePetRace(text)}
          />
        </View>

        <TextInput
          style={styles.border}
          value={this.props.post.description}
          onChangeText={text => this.props.updateDescription(text)}
          placeholder='Details About The Pet'
        />
        <TouchableOpacity
          style={styles.border}
          onPress={() => this.setState({ showModal: true })}
        >
          <Text style={styles.gray}>
            {this.props.post.location
              ? this.props.post.location.name
              : 'Add a Location'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={this.post}>
          <Text>Post</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.submitToGoogle()}
        >
          <Text>Analyze Photo</Text>
        </TouchableOpacity>
        {this.state.googleResponse && (
          <FlatList
            data={this.state.googleResponse.responses[0].labelAnnotations}
            extraData={this.state}
            horizontal={false}
            numColumns={3}
            style={{ marginTop: 8 }}
            keyExtractor={this._keyExtractor}
            renderItem={({ item }) =>
              item.score > 0.9 ? <Text>{item.description}, </Text> : null
            }
          />
        )}
      </ScrollView>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateDescription,
      uploadPost,
      updateLocation,
      uploadPhoto,
      updatePostPhoto,
      updatePet,
      updatePetRace
    },
    dispatch
  );
};

const mapStateToProps = state => {
  return {
    post: state.post,
    user: state.user
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Post);
