import {
  Avatar,
  Heading,
  ControlSize,
  Text,
  useTheme,
  getStyle,
  TextProps,
  AvatarProps,
  getOverrides,
  WithOverrides,
  HeadingProps,
} from 'paramount-ui';
import React from 'react';
import { ViewProps, View } from 'react-native';

import { Image } from '../generated/MutationsAndQueries';
import { OptionalString } from '../types';

import { getImageSource } from './ImageUtils';

export type AvatarProfileOrientation = 'vertical' | 'horizontal';

export interface AvatarProfileBaseProps {
  image?: Image | null;
  name?: string | null;
  description?: string;
  size?: ControlSize;
  orientation?: AvatarProfileOrientation;
}

export interface AvatarProfileOverrides {
  Root: RootProps;
  Avatar: AvatarProps;
  TextWrapper: TextWrapperProps;
  Title: TitleProps;
  Description: DescriptionProps;
}

export interface AvatarProfileProps
  extends WithOverrides<AvatarProfileBaseProps, AvatarProfileOverrides> {}

export const AvatarProfile = (props: AvatarProfileProps) => {
  const {
    image,
    name,
    description,
    size = 'medium',
    orientation = 'horizontal',
    overrides = {},
  } = props;

  const [Root, rootProps] = getOverrides(
    StyledRoot,
    props,
    { orientation, size },
    overrides.Root,
  );
  const [TextWrapper, textWrapperProps] = getOverrides(
    StyledTextWrapper,
    props,
    { orientation, size },
    overrides.TextWrapper,
  );
  const [Title, titleProps] = getOverrides(
    StyledTitle,
    props,
    { title: name, orientation, size },
    overrides.Title,
  );
  const [Description, descriptionProps] = getOverrides(
    StyledDescription,
    props,
    { description, size, orientation },
    overrides.Description,
  );
  const [AvatarR, avatarProps] = getOverrides(
    StyledAvatar,
    props,
    { source: getImageSource(image), size, name: name || '' },
    overrides.Avatar,
  );

  return (
    <Root {...rootProps}>
      <AvatarR {...avatarProps} />
      <TextWrapper {...textWrapperProps}>
        <Title {...titleProps} />
        <Description {...descriptionProps} />
      </TextWrapper>
    </Root>
  );
};

interface RootProps extends ViewProps {
  children?: React.ReactNode;
  orientation: AvatarProfileOrientation;
  size: ControlSize;
}

const StyledRoot = (props: RootProps) => {
  const { children, style, orientation, size, ...viewProps } = props;
  const theme = useTheme();

  return (
    <View
      style={[
        {
          flexDirection: orientation === 'horizontal' ? 'row' : 'column',
          alignItems: 'center',
        },
        style,
      ]}
      testID="AVATAR_PROFILE"
      {...viewProps}
    >
      {children}
    </View>
  );
};

interface TitleProps extends HeadingProps {
  title?: OptionalString;
  orientation: AvatarProfileOrientation;
}

const StyledTitle = (props: TitleProps) => {
  const { title, style, size, orientation, ...headingProps } = props;

  if (!title) return null;

  return (
    <Heading
      align={orientation === 'horizontal' ? 'left' : 'center'}
      size={size}
      style={[{}, getStyle(props, style)]}
      {...headingProps}
    >
      {title}
    </Heading>
  );
};

interface TextWrapperProps extends ViewProps {
  children?: React.ReactNode;
  orientation: AvatarProfileOrientation;
  size: ControlSize;
}

const StyledTextWrapper = (props: TextWrapperProps) => {
  const { children, style, size, orientation, ...viewProps } = props;
  const theme = useTheme();

  return (
    <View
      style={[
        {
          paddingLeft:
            orientation === 'horizontal' ? theme.controlPaddings[size] : 0,
        },
        getStyle(props, style),
      ]}
      {...viewProps}
    >
      {children}
    </View>
  );
};

interface DescriptionProps extends TextProps {
  description?: OptionalString;
  orientation: AvatarProfileOrientation;
  size: ControlSize;
}

const StyledDescription = (props: DescriptionProps) => {
  const { style, description, size, orientation, ...viewProps } = props;

  if (!description) return null;

  return (
    <Text
      size={size}
      color="muted"
      style={[{}, getStyle(props, style)]}
      align={orientation === 'horizontal' ? 'left' : 'center'}
      {...viewProps}
    >
      {description}
    </Text>
  );
};

const StyledAvatar = (props: AvatarProps) => {
  const { source, name } = props;

  if (!source && !name) return null;

  return <Avatar {...props} />;
};
