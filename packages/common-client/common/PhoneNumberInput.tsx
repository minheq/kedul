import { countries } from 'countries-list';
import {
  Box,
  Button,
  Container,
  ListItem,
  Modal,
  TextInput,
  useTheme,
  TextInputProps,
} from 'paramount-ui';
import React from 'react';
import { FlatList } from 'react-native';

import { Header } from '../layout';

import { CloseButton } from './CloseButton';

export interface PhoneNumberInputProps extends TextInputProps {
  countryCode?: string;
  onChangeCountryCode?: (countryCode: string) => void;
  phoneNumber?: string;
  onChangePhoneNumber?: (phoneNumber: string) => void;
}

export interface CountryCode {
  /** The value for countryCode */
  value: string;
  /** Labels used in the list of countries to select the country code from */
  label: string;
}

const countryCodes = Object.keys(countries).map(countryCode => ({
  // @ts-ignore
  label: countries[countryCode].name,
  // @ts-ignore
  value: countryCode,
}));

interface CountryCodeListProps {
  countryCode?: string;
  onChangeCountryCode?: (countryCode: string) => void;
  /** Label displayed when showing country selection */
}

const CountryCodeList = (props: CountryCodeListProps) => {
  const { onChangeCountryCode } = props;
  const theme = useTheme();

  return (
    <Box flex={1}>
      <FlatList
        keyExtractor={item => item.label}
        getItemLayout={(data, index) => ({
          index,
          length: theme.controlHeights.medium,
          offset: theme.controlHeights.medium * index,
        })}
        data={countryCodes}
        renderItem={({ item }) => {
          return (
            <ListItem
              key={item.label}
              title={item.label}
              onPress={event => {
                event.preventDefault();
                if (onChangeCountryCode) {
                  onChangeCountryCode(item.value);
                }
              }}
            />
          );
        }}
      />
    </Box>
  );
};

export const PhoneNumberInput = (props: PhoneNumberInputProps) => {
  const {
    countryCode = '1',
    phoneNumber,
    onChangeCountryCode,
    onChangePhoneNumber,
    ...textInputProps
  } = props;
  const theme = useTheme();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <Box flexDirection="row">
      <Button
        appearance="outline"
        color="default"
        // @ts-ignore
        title={`+${countries[countryCode].phone}`}
        overrides={{
          Touchable: {
            style: {
              borderBottomRightRadius: 0,
              borderColor: theme.colors.border.default,
              borderTopRightRadius: 0,
              borderWidth: 1,
              paddingLeft: 16,
              paddingRight: 8,
            },
          },
        }}
        onPress={() => setIsModalOpen(true)}
      />
      <TextInput
        textContentType="telephoneNumber"
        keyboardType="phone-pad"
        value={phoneNumber}
        onValueChange={onChangePhoneNumber}
        testID="PHONE_NUMBER_INPUT"
        overrides={{
          Root: {
            style: {
              flex: 1,
            },
          },
          Input: {
            style: {
              borderBottomLeftRadius: 0,
              borderTopLeftRadius: 0,
            },
          },
        }}
        {...textInputProps}
      />

      <Modal
        visible={isModalOpen}
        useHistory
        onRequestClose={() => setIsModalOpen(false)}
      >
        <Header left={<CloseButton onPress={() => setIsModalOpen(false)} />} />
        <Container style={{ height: '100%' }}>
          <CountryCodeList
            countryCode={countryCode}
            onChangeCountryCode={code => {
              if (onChangeCountryCode) onChangeCountryCode(code);
              setIsModalOpen(false);
            }}
          />
        </Container>
      </Modal>
    </Box>
  );
};
