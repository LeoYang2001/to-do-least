import React, { useState } from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

export default function BottomSheetScreen({ visible, onClose }) {
    
  const snapPoints = ['50%'];

  const handleClosePress = () => onClose();

  if (!visible) {
    return null;
  }

  return (
    <BottomSheet 
    enablePanDownToClose={true}
    overDragResistanceFactor={10}
    index={0} snapPoints={snapPoints}
     onChange={() => {
        console.log('closed/opened');
        
     }}>
      <View style={styles.contentContainer}>
        <Text>Awesome 🎉</Text>
        <Button title="Close Sheet" onPress={handleClosePress} />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});
