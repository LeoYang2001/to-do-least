import React, { useMemo } from "react";
import { BottomSheetBackgroundProps } from "@gorhom/bottom-sheet";
import Animated from "react-native-reanimated";

const CustomBackground = ({ style, animatedIndex }) => {
  //#region styles
  const containerAnimatedStyle = Animated.useAnimatedStyle(() => ({
    // @ts-ignore
    backgroundColor: Animated.interpolateColor(
      animatedIndex.value,
      [0, 1],
      ["#ffffff", "#a8b5eb"]
    ),
  }));
  const containerStyle = useMemo(() => [style, containerAnimatedStyle], [
    style,
    containerAnimatedStyle,
  ]);
  //#endregion

  // render
  return <Animated.View pointerEvents="none" style={containerStyle} />;
};

export default CustomBackground;
