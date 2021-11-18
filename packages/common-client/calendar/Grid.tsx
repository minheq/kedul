import { Box, useTheme, ViewMeasure } from 'paramount-ui';
import React from 'react';
import {
  GestureResponderEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  PanResponder,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import {
  cutOffNegativeVectors,
  makePosition,
  makeVectorsWithWidthRatio,
} from './GridUtils';

export interface Vector {
  id: string;
  x: number;
  y: number;
  magnitude: number;
}

export interface VectorWithWidthRatio extends Vector {
  widthRatio: number;
  offsetWidth: number;
}

export interface NewVector extends VectorWithWidthRatio {
  isDirty: boolean;
}

export interface BlockProps {
  vector: Vector;
}

export interface ColumnHeaderProps {
  x: number;
  minWidth: number;
}

export interface GridProps {
  maxY: number;
  minHeight: number;
  minColumnWidth: number;
  onNew?: (vector: Vector) => void;
  onUpdate?: (prevVector: Vector, vector: Vector) => void;
  onPress?: (vector: Vector) => void;
  vectors: Vector[][];
  components: {
    LeftTopCell?: React.ComponentType<any>;
    LeftColumn?: React.ComponentType<any>;
    Background?: React.ComponentType<any>;
    ColumnHeader?: React.ComponentType<ColumnHeaderProps>;
    Block?: React.ComponentType<BlockProps>;
    NewBlock?: React.ComponentType<BlockProps>;
  };
}

const makeNewVector = (x: number, y: number): NewVector => {
  return {
    x,
    y,
    magnitude: 12,
    id: 'new',
    offsetWidth: 0,
    widthRatio: 1,
    isDirty: false,
  };
};

// TODO: Implement dragging of calendar events
// - Dragging bottom and upper edge of a vector
// - Cutoff overflowing vectors
// - Dragging overflowing vectors
// - Auto-scroll of ScrollView
const IS_DRAGGING_SUPPORTED = false;
const SCROLL_EVENT_THROTTLE = 24;

export const Grid = (props: GridProps) => {
  const {
    vectors,
    maxY,
    components,
    minHeight,
    minColumnWidth,
    onNew = () => {},
    onUpdate,
    onPress = () => {},
  } = props;
  const {
    LeftColumn,
    Background,
    Block,
    NewBlock,
    LeftTopCell,
    ColumnHeader,
  } = components;
  const [newVector, setNewVector] = React.useState<NewVector | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const headerScrollView = React.useRef<ScrollView>(null);
  const gridHorizontalScrollView = React.useRef<ScrollView>(null);

  const handlePressColumnBackground = React.useCallback(
    (x, y) => {
      if (newVector) setNewVector(null);
      else setNewVector(makeNewVector(x, y));
    },
    [newVector, setNewVector],
  );

  const handlePressVector = React.useCallback(
    (vector: Vector) => {
      setNewVector(null);
      onPress(vector);
    },
    [setNewVector, onPress],
  );

  const handleDragging = React.useCallback(
    (isDragging: boolean) => setIsDragging(isDragging),
    [setIsDragging],
  );

  const handlePressNewVector = React.useCallback(
    (vector: Vector) => {
      setNewVector(null);
      onNew(vector);
    },
    [onNew],
  );

  const handleUpdateNewVector = React.useCallback(
    (prevVector: Vector, nextNewVector: Vector) => {
      if (newVector) {
        setNewVector({
          ...newVector,
          x: nextNewVector.x,
          y: nextNewVector.y,
          magnitude: nextNewVector.magnitude,
          isDirty: true,
        });
      }
    },
    [setNewVector, newVector],
  );

  const handleGridHorizontalScroll = React.useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (headerScrollView.current) {
        headerScrollView.current.scrollTo({
          animated: false,
          x: e.nativeEvent.contentOffset.x,
        });
      }
    },
    [headerScrollView],
  );

  const handleHeaderHorizontalScroll = React.useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (gridHorizontalScrollView.current) {
        gridHorizontalScrollView.current.scrollTo({
          animated: false,
          x: e.nativeEvent.contentOffset.x,
        });
      }
    },
    [gridHorizontalScrollView],
  );

  return (
    <Box flex={1}>
      {ColumnHeader && (
        <Box minHeight={48} flexDirection="row">
          {LeftTopCell && <LeftTopCell />}
          <ScrollView
            horizontal
            ref={headerScrollView}
            onScroll={handleHeaderHorizontalScroll}
            scrollEventThrottle={SCROLL_EVENT_THROTTLE}
          >
            {vectors.map((v, x) => (
              <Box key={x} minWidth={minColumnWidth}>
                <ColumnHeader minWidth={minColumnWidth} x={x} />
              </Box>
            ))}
          </ScrollView>
        </Box>
      )}
      <ScrollView
        scrollEnabled={!isDragging}
        style={{ flex: 1 }}
        contentContainerStyle={{ flex: 1 }}
      >
        <Box minHeight={minHeight} flex={1} flexDirection="row">
          {LeftColumn && <LeftColumn />}
          <ScrollView
            horizontal
            ref={gridHorizontalScrollView}
            onScroll={handleGridHorizontalScroll}
            scrollEventThrottle={SCROLL_EVENT_THROTTLE}
          >
            {Background && (
              <Box
                position="absolute"
                width={vectors.length * minColumnWidth}
                height="100%"
              >
                <Background />
              </Box>
            )}
            <Box flexDirection="row" flex={1}>
              {vectors.map(cutOffNegativeVectors).map((columnVectors, x) => (
                <Column
                  key={x}
                  x={x}
                  maxY={maxY}
                  vectors={columnVectors}
                  minColumnWidth={minColumnWidth}
                  newVector={newVector && newVector.x === x ? newVector : null}
                  onUpdate={onUpdate}
                  onPress={handlePressVector}
                  onPressColumnBackground={handlePressColumnBackground}
                  onUpdateNewVector={handleUpdateNewVector}
                  onDragging={handleDragging}
                  onPressNewVector={handlePressNewVector}
                  Block={Block}
                  NewBlock={NewBlock}
                />
              ))}
            </Box>
          </ScrollView>
        </Box>
      </ScrollView>
    </Box>
  );
};

interface ColumnBackgroundProps {
  maxY: number;
  x: number;
  onPress: (x: number, y: number) => void;
  columnHeight: number;
}

const ColumnBackground = (props: ColumnBackgroundProps) => {
  const { x, onPress, columnHeight, maxY } = props;

  const handleCreateNewVector = React.useCallback(
    (event: GestureResponderEvent) => {
      const y = Math.round(
        ((columnHeight - event.nativeEvent.locationY) / columnHeight) * maxY,
      );
      onPress(x, y);
    },
    [columnHeight, maxY, x, onPress],
  );

  return (
    <TouchableWithoutFeedback onPress={handleCreateNewVector}>
      <View
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
        }}
      />
    </TouchableWithoutFeedback>
  );
};

interface ColumnProps {
  x: number;
  maxY: number;
  minColumnWidth: number;
  vectors: Vector[];
  newVector: NewVector | null;
  Block?: React.ComponentType<BlockProps>;
  NewBlock?: React.ComponentType<BlockProps>;

  onUpdate?: (prevVector: Vector, vector: Vector) => void;
  onPress?: (vector: Vector) => void;
  onPressColumnBackground: (x: number, y: number) => void;
  onDragging: (isDragging: boolean) => void;
  onPressNewVector?: (vector: Vector) => void;
  onUpdateNewVector: (prevVector: Vector, nextNewVector: Vector) => void;
}

const Column = (props: ColumnProps) => {
  const {
    x,
    maxY,
    vectors,
    Block,
    minColumnWidth,
    NewBlock,
    onPressColumnBackground,
    newVector,
    onUpdateNewVector,
    onDragging,
    onPressNewVector,
    onUpdate,
    onPress,
  } = props;
  const theme = useTheme();

  return (
    <ViewMeasure style={{ flex: 1, minWidth: minColumnWidth }}>
      {({ height: columnHeight, width: columnWidth }) => (
        <Box
          flex={1}
          borderRightWidth={1}
          borderColor={theme.colors.border.default}
        >
          <Box width="100%" flex={1}>
            <ColumnBackground
              x={x}
              onPress={onPressColumnBackground}
              columnHeight={columnHeight}
              maxY={maxY}
            />
            {makeVectorsWithWidthRatio(vectors).map(vector => (
              <Vector
                key={vector.id}
                columnHeight={columnHeight}
                columnWidth={columnWidth}
                Block={Block}
                vector={vector}
                maxY={maxY}
                onDragging={onDragging}
                maxX={vectors.length}
                onUpdate={onUpdate}
                onPress={onPress}
              />
            ))}
            {newVector && (
              <Vector
                vector={newVector}
                columnHeight={columnHeight}
                columnWidth={columnWidth}
                maxY={maxY}
                onDragging={onDragging}
                maxX={vectors.length}
                onPress={onPressNewVector}
                onUpdate={onUpdateNewVector}
                Block={NewBlock}
              />
            )}
          </Box>
        </Box>
      )}
    </ViewMeasure>
  );
};

interface UseVectorPanResponderCallbacks {
  onPress: () => void;
  onMoveStart: () => void;
  onMove: (dx: number, dy: number) => void;
  onMoveEnd: () => void;
}

interface UseVectorPanResponderConfig {
  vector: Vector;
  maxY: number;
  maxX: number;
  pixelsPerX: number;
  pixelsPerY: number;
}

const useVectorPanResponder = (
  callbacks: UseVectorPanResponderCallbacks,
  config: UseVectorPanResponderConfig,
) => {
  const LONG_PRESS_DELAY = 500;

  const callbacksRef = React.useRef(callbacks);
  const configRef = React.useRef(config);

  React.useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  React.useEffect(() => {
    configRef.current = config;
  }, [config]);

  let onLongPressTimeout: number;
  let isLongPress = false;

  const panResponderRef = React.useRef(
    PanResponder.create({
      onPanResponderTerminationRequest: () => false,

      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: () => {
        const { onMoveStart } = callbacksRef.current;

        if (IS_DRAGGING_SUPPORTED) {
          onLongPressTimeout = setTimeout(() => {
            isLongPress = true;
            onMoveStart();
          }, LONG_PRESS_DELAY);
        }
      },

      onPanResponderMove: (event, { dy: dyPixels, dx: dxPixels }) => {
        if (!isLongPress) return;

        event.preventDefault();

        const { onMove } = callbacksRef.current;
        const {
          vector,
          maxY,
          maxX,
          pixelsPerX,
          pixelsPerY,
        } = configRef.current;
        const minDx = -vector.x;
        const maxDx = maxX - vector.x;
        const minDy = -(maxY - vector.y) - vector.magnitude;
        const maxDy = vector.y;

        const dx = Math.max(
          Math.min(Math.round(dxPixels / pixelsPerX), maxDx),
          minDx,
        );
        const dy = Math.max(
          Math.min(Math.round(dyPixels / pixelsPerY), maxDy),
          minDy,
        );

        onMove(dx, dy);
      },

      onPanResponderRelease: event => {
        const { onMoveEnd, onPress } = callbacksRef.current;

        event.preventDefault();

        if (!isLongPress) {
          onPress();
        } else {
          isLongPress = false;
          clearTimeout(onLongPressTimeout);
          onMoveEnd();
        }
      },

      onPanResponderTerminate: () => {
        isLongPress = false;
        clearTimeout(onLongPressTimeout);
      },

      onShouldBlockNativeResponder: () => false,
    }),
  );

  return panResponderRef.current;
};

interface VectorProps {
  onUpdate?: (prevVector: Vector, nextVector: Vector) => void;
  onPress?: (vector: Vector) => void;
  onDragging: (isDragging: boolean) => void;
  vector: VectorWithWidthRatio;
  maxY: number;
  maxX: number;
  columnWidth: number;
  columnHeight: number;
  Block?: React.ComponentType<BlockProps>;
}

const Vector = (props: VectorProps) => {
  const {
    vector,
    Block,
    maxY,
    maxX,
    columnHeight,
    columnWidth,
    onDragging,
    onUpdate = () => {},
    onPress = () => {},
  } = props;
  const pixelsPerY = columnHeight / maxY;
  const pixelsPerX = columnWidth;

  const [delta, setDelta] = React.useState({ dy: 0, dx: 0 });

  const handlePress = React.useCallback(() => {
    onPress(vector);
  }, [onPress, vector]);

  const handleMoveStart = React.useCallback(() => {
    onDragging(true);
  }, [onDragging]);

  const handleMove = React.useCallback((dx: number, dy: number) => {
    setDelta({ dy, dx });
  }, []);

  const handleMoveEnd = React.useCallback(() => {
    onDragging(false);

    const nextVector: Vector = {
      ...vector,
      x: vector.x + delta.dx,
      y: vector.y - delta.dy,
    };

    onUpdate(vector, nextVector);
    setDelta({ dy: 0, dx: 0 });
  }, [onDragging, vector, delta.dx, delta.dy, onUpdate]);

  const panResponder = useVectorPanResponder(
    {
      onMoveStart: handleMoveStart,
      onMove: handleMove,
      onMoveEnd: handleMoveEnd,
      onPress: handlePress,
    },
    { maxX, maxY, pixelsPerX, pixelsPerY, vector },
  );

  const position = makePosition(vector, pixelsPerY, maxY);

  return (
    <Box
      position="absolute"
      height={position.height}
      top={position.top}
      left={position.left}
      width={position.width}
      paddingRight={2}
      // @ts-ignore
      userSelect="none"
    >
      <View
        style={{
          width: '100%',
          height: '100%',
          left: delta.dx * pixelsPerX,
          top: delta.dy * pixelsPerY,
          // @ts-ignore
          cursor: 'pointer',
        }}
        {...panResponder.panHandlers}
      >
        {Block && <Block vector={vector} />}
      </View>
    </Box>
  );
};
