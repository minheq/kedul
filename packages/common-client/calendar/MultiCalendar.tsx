import { format, isBefore, isSameDay, isSameMonth } from 'date-fns';
import { Avatar, Box, Icon, Text, useTheme } from 'paramount-ui';
import React from 'react';
import {
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';

const DEFAULT_LISTING_COLUMN_WIDTH = 300;
const DEFAULT_HEADER_CELL_HEIGHT = 90;
const DEFAULT_CELL_WIDTH = 80;
const DEFAULT_CELL_HEIGHT = 48;

export interface ArrowProps {
  onPress?: () => void;
}

export const ArrowPrevious = (props: ArrowProps) => {
  const { onPress } = props;

  return (
    <Box
      height="100%"
      zIndex={1}
      width={24}
      left={0}
      position="absolute"
      backgroundColor="white"
    >
      <TouchableOpacity
        onPress={onPress}
        style={{
          alignItems: 'center',
          height: '100%',
          justifyContent: 'center',
        }}
      >
        <View>
          <Icon name="chevron-left" />
        </View>
      </TouchableOpacity>
    </Box>
  );
};

export const ArrowNext = (props: ArrowProps) => {
  const { onPress } = props;

  return (
    <Box
      height="100%"
      zIndex={1}
      width={24}
      right={0}
      position="absolute"
      backgroundColor="white"
    >
      <TouchableOpacity
        onPress={onPress}
        style={{
          alignItems: 'center',
          height: '100%',
          justifyContent: 'center',
        }}
      >
        <View>
          <Icon name="chevron-right" />
        </View>
      </TouchableOpacity>
    </Box>
  );
};

export type Channel = 'airbnb' | 'booking' | 'tripadvisor' | 'unknown';

export interface ListingDetails {
  id: string;
  title: string;
  date?: string;
  endTime: Date;
  startTime: Date;
  channel: Channel;
  hasStay: boolean;
  imgSource: string;
  guestName: string;
  lengthOfStay: number;
}

const OFFSET_INDEX_FROM_TODAY = 2;

export interface ListingCellProps {
  height: number;
  width: number;
  listing: ListingDetails;
}

export const ListingCell = (props: ListingCellProps) => {
  const { listing, height, width } = props;
  const theme = useTheme();

  const imageWidth = 80;
  const textWidth = width > 200 ? width - imageWidth : 0;

  return (
    <Box
      height={height}
      padding={4}
      flexDirection="row"
      borderColor={theme.colors.border.default}
      key={listing.id}
      borderBottomWidth={1}
    >
      <Box>
        <Image
          source={{
            height: height - 8 - 1,
            uri: listing.imgSource,
            width: imageWidth - 8,
          }}
        />
      </Box>
      {textWidth > 0 && (
        <Box width={textWidth} paddingLeft={8}>
          <Text selectable={false} size="small">
            {listing.title}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export const TopLeftCell = () => <Box />;

export interface DayHeaderCellProps {
  date: Date;
}

export const HeaderCell = (props: DayHeaderCellProps) => {
  const { date } = props;
  const theme = useTheme();

  return (
    <Box borderBottomWidth={1} borderColor={theme.colors.border.default}>
      <Box
        height={DEFAULT_HEADER_CELL_HEIGHT - DEFAULT_CELL_HEIGHT - 1}
        justifyContent="center"
        alignItems="center"
        paddingLeft={4}
      />
      <Box
        key={date.getTime()}
        flex={1}
        height={DEFAULT_CELL_HEIGHT}
        width={DEFAULT_CELL_WIDTH}
        paddingHorizontal={2}
        paddingVertical={2}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Text selectable={false} size="small">
          {format(date, 'ddd')}
        </Text>
        <Text selectable={false} size="large">
          {format(date, 'd')}
        </Text>
      </Box>
    </Box>
  );
};

export interface BodyCellProps {
  listing: ListingDetails;
}

const matchChannelToColor = (channel: Channel) => {
  switch (channel) {
    case 'airbnb':
      return 'red';
    case 'booking':
      return 'blue';
    case 'tripadvisor':
      return 'green';
    default:
      return 'green';
  }
};

const matchChannelToTitle = (channel: Channel) => {
  switch (channel) {
    case 'airbnb':
      return 'Airbnb';
    case 'booking':
      return 'Booking';
    case 'tripadvisor':
      return 'Trip Advisor';
    default:
      return 'Unknown';
  }
};

export const BodyCell = (props: BodyCellProps) => {
  const { listing } = props;
  const theme = useTheme();

  return (
    <Box
      borderBottomWidth={1}
      borderRightWidth={1}
      borderColor={theme.colors.border.default}
      height={DEFAULT_CELL_HEIGHT}
      width={DEFAULT_CELL_WIDTH}
      position="relative"
    >
      {listing.hasStay && (
        <Box
          position="absolute"
          width={listing.lengthOfStay * DEFAULT_CELL_WIDTH + 10}
          minWidth={58}
          top={4}
          left={20}
          alignItems="center"
          flexDirection="row"
          paddingLeft={8}
          height={40}
          backgroundColor={
            theme.fills.solid[matchChannelToColor(listing.channel)]
              .backgroundColor
          }
          overflow="hidden"
          shape="pill"
        >
          <Box paddingRight={4}>
            <Avatar
              name={listing.channel}
              color={matchChannelToColor(listing.channel)}
            />
          </Box>
          <Text selectable={false} numberOfLines={1} color="plain">
            {listing.guestName} · {matchChannelToTitle(listing.channel)}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export interface MultiCalendarData<TListing = any> {
  date: Date;
  key: string;
  listings: TListing[];
}

export interface MultiCalendarProps<TListing = any> {
  title?: string;
  data: MultiCalendarData<TListing>[];
  height: number;
  currentDate?: Date;
  width: number;
  cellWidth?: number;
  onPressNext?: () => void;
  onPressPrevious?: () => void;
  renderBodyCell?: (
    listing: TListing,
    date: Date,
    index: number,
  ) => React.ReactNode;
  renderListingCell?: (
    listing: TListing,
    index: number,
    width: number,
    height: number,
  ) => React.ReactNode;
  renderHeaderCell?: (date: Date) => React.ReactNode;
  renderTopLeftCell?: () => React.ReactNode;
  listingColumnWidth?: number;
  headerCellHeight?: number;
}

const defaulRenderListingCell = (
  listing: ListingDetails,
  index: number,
  width: number,
  height: number,
) => (
  <ListingCell
    key={listing.id}
    listing={listing}
    width={width}
    height={height}
  />
);

const defaultRenderHeaderCell = (date: Date) => (
  <HeaderCell key={date.getTime()} date={date} />
);

const defaultRenderBodyCell = (listing: ListingDetails) => (
  <BodyCell key={listing.id} listing={listing} />
);

const defaultRenderTopLeftCell = () => <TopLeftCell />;

const getInitialScrollIndex = (currentDate: Date) => {
  const today = new Date();

  return isSameMonth(currentDate, today)
    ? currentDate.getDate() - OFFSET_INDEX_FROM_TODAY
    : isBefore(currentDate, today)
    ? 22
    : 0;
};
export class MultiCalendar extends React.Component<
  MultiCalendarProps<ListingDetails>
> {
  public bodyContainer = React.createRef<
    FlatList<MultiCalendarData<ListingDetails>>
  >();
  public headerContainer = React.createRef<
    FlatList<MultiCalendarData<ListingDetails>>
  >();

  public componentDidUpdate() {
    const { currentDate = new Date() } = this.props;

    if (this.headerContainer.current) {
      const initialScrollIndex = getInitialScrollIndex(currentDate);
      this.headerContainer.current.scrollToIndex({
        animated: false,
        index: initialScrollIndex,
      });
    }

    if (this.bodyContainer.current) {
      const initialScrollIndex = getInitialScrollIndex(currentDate);
      this.bodyContainer.current.scrollToIndex({
        animated: false,
        index: initialScrollIndex,
      });
    }
  }

  public handleBodyOnScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (this.headerContainer.current) {
      this.headerContainer.current.scrollToOffset({
        animated: false,
        offset: e.nativeEvent.contentOffset.x,
      });
    }
  };

  public handleHeaderScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (this.bodyContainer.current) {
      this.bodyContainer.current.scrollToOffset({
        animated: false,
        offset: e.nativeEvent.contentOffset.x,
      });
    }
  };

  public render() {
    const {
      data,
      currentDate = new Date(),
      headerCellHeight = DEFAULT_HEADER_CELL_HEIGHT,
      cellWidth = DEFAULT_CELL_WIDTH,
      height,
      listingColumnWidth = DEFAULT_LISTING_COLUMN_WIDTH,
      onPressNext = () => null,
      onPressPrevious = () => null,
      renderBodyCell = defaultRenderBodyCell,
      renderHeaderCell = defaultRenderHeaderCell,
      renderListingCell = defaulRenderListingCell,
      renderTopLeftCell = defaultRenderTopLeftCell,
      title,
      width,
    } = this.props;
    const theme = useTheme();

    const listings = data[0] ? data[0].listings : [];
    const initialScrollIndex = getInitialScrollIndex(currentDate);
    const getItemLayout = (
      _: MultiCalendarData<ListingDetails>[] | null,
      index: number,
    ) => ({
      index,
      length: cellWidth,
      offset: cellWidth * index,
    });

    return (
      <Box>
        <Box height={headerCellHeight} flexDirection="row">
          <Box width={listingColumnWidth}>{renderTopLeftCell()}</Box>
          <Box position="relative" width={width - listingColumnWidth}>
            <Box paddingLeft={24} position="absolute">
              <Text weight="bold" size="large">
                {title}
              </Text>
            </Box>
            <ArrowPrevious onPress={onPressPrevious} />
            <ArrowNext onPress={onPressNext} />
            <Box>
              <FlatList
                horizontal
                onScroll={this.handleHeaderScroll}
                ref={this.headerContainer}
                data={data}
                getItemLayout={getItemLayout}
                initialScrollIndex={initialScrollIndex}
                renderItem={({ item }) => {
                  return (
                    <Box key={item.date.getTime()} position="relative">
                      {renderHeaderCell(item.date)}
                    </Box>
                  );
                }}
              />
            </Box>
          </Box>
        </Box>
        <Box
          height={height - headerCellHeight}
          position="relative"
          flexDirection="row"
        >
          <ScrollView>
            <Box elevation={1} width={listingColumnWidth} position="absolute">
              {listings.map((listing, index) => (
                <Box key={listing.id}>
                  {renderListingCell(
                    listing,
                    index,
                    listingColumnWidth,
                    DEFAULT_CELL_HEIGHT,
                  )}
                </Box>
              ))}
            </Box>
            <Box
              position="absolute"
              width={width - listingColumnWidth}
              marginLeft={listingColumnWidth}
            >
              <Box position="relative">
                <Box width={width - listingColumnWidth}>
                  {/*
                  // @ts-ignore */}
                  <FlatList
                    horizontal
                    ref={this.bodyContainer}
                    onScroll={this.handleBodyOnScroll}
                    initialScrollIndex={initialScrollIndex}
                    data={data}
                    // @ts-ignore
                    CellRendererComponent={props => {
                      const zIndex = data.length - props.index;
                      return <View {...props} style={{ zIndex }} />;
                    }}
                    getItemLayout={getItemLayout}
                    renderItem={({ item }) => {
                      const isToday = isSameDay(
                        new Date(item.date),
                        currentDate,
                      );
                      const isBeforeToday = isBefore(item.date, new Date());

                      return (
                        <Box
                          backgroundColor={
                            isBeforeToday
                              ? theme.colors.background.greyLight
                              : theme.colors.background.base
                          }
                          borderLeftColor={
                            isToday ? theme.colors.text.default : undefined
                          }
                          borderLeftWidth={isToday ? 1 : 0}
                          key={item.date.getTime()}
                          position="relative"
                        >
                          {item.listings.map((listing, listingIndex) =>
                            renderBodyCell(listing, item.date, listingIndex),
                          )}
                        </Box>
                      );
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </ScrollView>
        </Box>
      </Box>
    );
  }
}
