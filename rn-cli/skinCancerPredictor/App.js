/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, Picker, StyleSheet, Text, View, Image, Button} from 'react-native';
//import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
//import { RadioForm, RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button'; 
import ImagePicker from 'react-native-image-picker';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const radio_props = [
  {label: 'Female', value: 'female' },
  {label: 'Male', value: 'male' },
  {label: 'Other', value: 'other'}
];

type Props = {};
export default class App extends Component<Props> {
  state = {
    photo: null,
    anotherPhoto: false,
    step: 1,
    age: 0,
    gender: '',
    localization: ''
  }

  handleChoosePhoto = () => {
    const options = {
      noData: true
    }
    ImagePicker.launchImageLibrary(options, response => {
      if(response.uri){
        this.setState({
          photo: response,
          anotherPhoto: true,
          step: 2
        });
      }
    })
  }

  handleUploadPhoto = () => {
    //API URL address
    const URL = 'https://skin-cancer-predictor-flask.herokuapp.com'; //'http://192.168.99.1'; //'http://localhost';
    const ENDPOINT = '/predict';
    fetch(URL + ENDPOINT, {
      method: 'POST',
      body: createFormData(this.state.photo, {
        age: this.state.age,
        gender: this.state.gender,
        localization: this.state.localization 
      })
    })
      .then(response => response.json())
      .then(response => {
        console.log("Uploaded successfully: ", response);
        alert('Uploaded Successfully');
        this.setState({
          photo: null
        })
      })
      .catch(err => {
        console.log("ERROR uploading");
        alert("Upload Failed: " + err);
      });
  }

  render() {
    const { photo, anotherPhoto, step } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={styles.logo}>Smart Skincare</Text>
          <Text style={styles.poweredBy}>Powered by AI</Text>

          {
            photo && (
              <React.Fragment>
                <Image 
                  source={{uri: photo.uri }}
                  style={{ width: 300, height: 300, marginBottom:25 }}
                />
              </React.Fragment>
            )
          }

          {
            photo === null && (
              <View>
                <Text style={styles.instructions}>Get your skin tested right now</Text>
                {
                  step === 1 &&
                    <Text style={styles.instructions}>Upload an image of the affected area</Text>  
                }
              </View>
            )
          }

          {
            step === 2 && (
              <View>

              </View>
            )
          }
          
        </View>
        <View style={styles.buttonContainer}>
          {
            photo && (
                <Button style={styles.buttonCheck} 
                        title="Get Results" onPress={this.handleUploadPhoto} />
            )
          }
          <Text>{" "}</Text>
          <Button style={styles.buttonSelect}
                  title={anotherPhoto ? "Select Another Photo" : "Select Photo"} 
                  onPress={this.handleChoosePhoto} />
        </View>
       
      </View>
    );
  }
}

/*
  need to have an image of a human with different areas highlighted as they are selected by the person.
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'//'#F5FCFF',
  },
  logo: {
    fontSize: 40,
    textAlign: 'center',
    margin: 7,
    color: '#333333'
  },
  poweredBy: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 20
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    margin: 20,
    marginTop: 30
  },

  buttonsContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  buttonCheck: {
    margin: 20
  },
  buttonSelect: {
    marginTop: 10,
    margin: 20
  },
});

const createFormData = (photo, body) => {
  const data = new FormData();

  data.append("photo", {
    name: photo.fileName,
    type: photo.type,
    uri: Platform.OS === "android" ? photo.uri : photo.uri.replace("file://","")
  });

  Object.keys(body).forEach(key => {
    data.append(key, body[key]);
  });

  return data;
}

/*

  <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: 5,
          }}
        />
*/


  // onChangeAge = (e) => {
  //   console.log("event: ", e.target);
  //   this.setState({
  //     age: e.target.value
  //   });
  // }

  // formInputDone = () => {
  //   this.setState({
  //     step: 2
  //   })
  // }

/*
{
            step === 2 && (
              <View>
                <FormLabel>Your Age: </FormLabel>
                <FormInput onChangeText={this.onChangeAge} />
                <FormValidationMessage>Please input an age</FormValidationMessage>
                <RadioForm
                  radio_props={radio_props}
                  initial={0}
                  onPress={(value) => {this.setState({gender: value})}}
                />
                <Picker
                  selectedValue={this.state.localization}
                  style={{height: 50, width: 100}}
                  onValueChange={(itemValue, itemIndex) => this.setState({localization: itemValue})
                }>
                  <Picker.Item label="Face" value="face" />
                  <Picker.Item label="Ear" value="ear" />
                  <Picker.Item label="Scalp" value="scalp" />
                  <Picker.Item label="Back" value="back" />
                  <Picker.Item label="Torso" value="trunk" /> 
                  <Picker.Item label="Chest" value="chest" />
                  <Picker.Item label="Arm" value="upper extremity" />
                  <Picker.Item label="Leg" value="lower extremity" />
                  <Picker.Item label="Abdomen" value="abdomen" />
                  <Picker.Item label="Genital" value="genital" />
                  <Picker.Item label="Unknown" value="unknown" />
                </Picker> 
                <Button style={styles.buttonCheck} 
                        title="Done"
                        onPress={this.formInputDone}
                />
              </View>
            )
          }


*/