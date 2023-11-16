import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { Button } from 'react-native';

const TestingScreen = () => {
  // ref
  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(() => ['50%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleOpenPress = () => {
    bottomSheetRef.current?.expand();
  };

  // renders
  return (
    <View style={styles.container}>
        <Button className="" title="Open Bottom Sheet" onPress={handleOpenPress} />
      <BottomSheet
      enablePanDownToClose={true}
      overDragResistanceFactor={10}
        ref={bottomSheetRef}
        index={0}
        onChange={handleSheetChanges}
        snapPoints={snapPoints}
      >
        <View style={styles.contentContainer}>
          <Text>Awesome 🎉</Text>
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop:48,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default TestingScreen;
