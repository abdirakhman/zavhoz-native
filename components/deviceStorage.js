import { AsyncStorage } from 'react-native';

const deviceStorage = {
  // our AsyncStorage functions will go here :)
  async saveItem(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log('AsyncStorage Error: ' + error.message);
    }
  },
  async retrieveItem(key) {
    try {
      const retrievedItem =  await AsyncStorage.getItem(key);
      const item = (retrievedItem).toString();
      console.log(item);
      return item;
    } catch (error) {
      console.log(error.message);
    }
    return
  }
};

export default deviceStorage;