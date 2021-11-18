import {
  useCurrentBusiness,
  useCurrentLocation,
  useCurrentUser,
  useNavigation,
} from '@kedul/app-salon-core';
import { useI18n } from '@kedul/common-client';
import {
  Box,
  Column,
  Container,
  Heading,
  Row,
  Text,
  useLayout,
  Visible,
} from 'paramount-ui';
import React from 'react';
import { ScrollView } from 'react-native';

import { Footer } from '../components/Footer';
import { GetStartedButton } from '../components/GetStartedButton';
import { LandingPageBottomNavigationBar } from '../components/LandingPageBottomNavigationBar';
import { LandingPageHeader } from '../components/LandingPageHeader';

// TODO: Remove and Use real text
const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

// TODO: Add real image
// The height prop is just to simulate what happens when we use tall images
interface ImagePlaceholderProps {
  height?: string | number;
}

const ImagePlaceholder = (props: ImagePlaceholderProps) => {
  var height = props.height || '100%';
  if (typeof height === 'number') {
    height = height.toString() + 'px';
  }
  return (
    <Box
      justifyContent="center"
      alignItems="center"
      height={height}
      backgroundColor="greyDefault"
    />
  );
};

interface LandingPageSectionTextProps {
  heading: string;
  text: string;
  isRightSide?: boolean;
}

const LandingPageSectionText = (props: LandingPageSectionTextProps) => {
  const i18n = useI18n();
  const { getResponsiveValue } = useLayout();
  const right = props.isRightSide || false;
  const align = getResponsiveValue({
    xsmall: 'left',
    medium: right ? 'right' : 'left',
  });

  return (
    <Box justifyContent="center" flexDirection="column" height="100%">
      <Box paddingBottom={32}>
        <Heading
          accessibilityLevel={3}
          weight="500"
          align={align}
          size={getResponsiveValue({ xsmall: 'medium', medium: 'xlarge' })}
        >
          {i18n.t(props.heading)}
        </Heading>
      </Box>
      <Box paddingBottom={32}>
        <Text
          align={align}
          size={getResponsiveValue({ xsmall: 'medium', medium: 'large' })}
          color="muted"
        >
          {i18n.t(props.text)}
        </Text>
      </Box>
      <Row>
        <Column
          offsetLarge={right ? 3 : 0}
          offsetXlarge={right ? 5 : 0}
          large={9}
          xlarge={7}
        >
          <Box paddingBottom={48}>
            <GetStartedButton />
          </Box>
        </Column>
      </Row>
    </Box>
  );
};

const ForBusinessesSection = () => {
  const i18n = useI18n();
  const { getResponsiveValue } = useLayout();

  return (
    <Container>
      <Row>
        <Column offsetXlarge={3} offsetMedium={2} medium={8} xlarge={6}>
          <Box paddingBottom={32}>
            <Heading
              accessibilityLevel={2}
              align="center"
              size={getResponsiveValue({
                xsmall: 'medium',
                medium: 'xlarge',
              })}
            >
              {i18n.t('Perfect for every business')}
            </Heading>
          </Box>
          <Box paddingBottom={32}>
            <Text align="center">{i18n.t(lorem)}</Text>
          </Box>
        </Column>
      </Row>
      <Row>
        <Column offsetLarge={1} large={4} medium={6}>
          <Box paddingBottom={32}>
            <ImagePlaceholder />
          </Box>
          <Box paddingBottom={32}>
            <Heading accessibilityLevel={2} align="center">
              {i18n.t('For hair salons')}
            </Heading>
          </Box>
          <Box paddingBottom={8}>
            <ImagePlaceholder height={240} />
          </Box>
          <Box paddingBottom={32}>
            <Text>{i18n.t(lorem)}</Text>
          </Box>
        </Column>
        <Column offsetLarge={2} large={4} medium={6}>
          <Box paddingBottom={32}>
            <ImagePlaceholder />
          </Box>
          <Box paddingBottom={32}>
            <Heading accessibilityLevel={2} align="center">
              {i18n.t('For spa salons')}
            </Heading>
          </Box>
          <Box paddingBottom={8}>
            <ImagePlaceholder height={240} />
          </Box>
          <Box paddingBottom={32}>
            <Text>{i18n.t(lorem)}</Text>
          </Box>
        </Column>
      </Row>
    </Container>
  );
};

const TryTodaySection = () => {
  const i18n = useI18n();
  const { getResponsiveValue } = useLayout();

  return (
    <Container>
      <Row>
        <Column offsetXlarge={1} xlarge={10}>
          <Box backgroundColor="primaryLight" padding={48} borderRadius={8}>
            <Box paddingBottom={32}>
              <Heading
                accessibilityLevel={2}
                align="center"
                size={getResponsiveValue({
                  xsmall: 'medium',
                  medium: 'xlarge',
                })}
              >
                {i18n.t('Try Kedul today')}
              </Heading>
            </Box>
            <Row>
              <Column offsetMedium={2} medium={8}>
                <Box paddingBottom={32}>
                  <Text align="center">{i18n.t(lorem)}</Text>
                </Box>
              </Column>
            </Row>
            <Row>
              <Column offsetMedium={3} medium={6}>
                <Box paddingBottom={32}>
                  <GetStartedButton />
                </Box>
              </Column>
            </Row>
          </Box>
        </Column>
      </Row>
    </Container>
  );
};

const CashflowSection = () => {
  const { getResponsiveValue } = useLayout();

  return (
    <Container>
      <Row
        style={getResponsiveValue({
          xsmall: { flexWrap: 'wrap-reverse' },
          medium: { flexWrap: 'wrap' },
        })}
      >
        <Column offsetXlarge={1} medium={6} xlarge={5}>
          <Box paddingBottom={32} height="100%">
            <ImagePlaceholder height={480} />
          </Box>
        </Column>
        <Column medium={6} xlarge={5}>
          <Box paddingBottom={32} height="100%">
            <LandingPageSectionText
              heading="Know what flows in and out of your wallet"
              text={lorem}
              isRightSide={true}
            />
          </Box>
        </Column>
      </Row>
    </Container>
  );
};

const ClientSection = () => {
  return (
    <Container>
      <Row>
        <Column offsetXlarge={1} medium={6} xlarge={5}>
          <Box paddingBottom={32} height="100%">
            <LandingPageSectionText
              heading="Make your clients love your service"
              text={lorem}
            />
          </Box>
        </Column>
        <Column medium={6} xlarge={5}>
          <Box paddingBottom={32} height="100%">
            <ImagePlaceholder height={680} />
          </Box>
        </Column>
      </Row>
    </Container>
  );
};

const CalendarSection = () => {
  return (
    <Container>
      <Row>
        <Column offsetXlarge={1} medium={6} xlarge={5}>
          <Box paddingBottom={32} height="100%">
            <LandingPageSectionText
              heading="Stay up to date with your calendar"
              text={lorem}
            />
          </Box>
        </Column>
        <Column medium={6} xlarge={5}>
          <Box paddingBottom={32} height="100%">
            <ImagePlaceholder height={400} />
          </Box>
        </Column>
      </Row>
    </Container>
  );
};

const FeaturesIntroHeading = () => {
  const i18n = useI18n();
  const { getResponsiveValue } = useLayout();

  return (
    <Box paddingBottom={32}>
      <Heading
        accessibilityLevel={2}
        align="center"
        size={getResponsiveValue({
          xsmall: 'medium',
          medium: 'xlarge',
        })}
      >
        {i18n.t('Equip your business with the right tools')}
      </Heading>
    </Box>
  );
};

const Hero = () => {
  return (
    <Container>
      <Row>
        <Column offsetXlarge={1} medium={7} xlarge={6}>
          <Box paddingBottom={32} height="100%">
            <LandingPageSectionText
              heading="We make salon and spa management simple"
              text={
                'Kedul helps you run your business effortlessly. Management tools for your calendar, cash flow, clients and more - all in one place.'
              }
            />
          </Box>
        </Column>
        <Column medium={5} xlarge={4}>
          <Box paddingBottom={32} height="100%">
            <ImagePlaceholder height={400} />
          </Box>
        </Column>
      </Row>
    </Container>
  );
};

export const LandingPage = () => {
  const { getResponsiveValue } = useLayout();
  const { currentUser } = useCurrentUser();
  const { currentBusiness } = useCurrentBusiness();
  const { currentLocation } = useCurrentLocation();
  const { navigate } = useNavigation();

  if (currentUser && currentBusiness && currentLocation) {
    navigate('CalendarOverview');
    return null;
  }

  const sectionSpacing = getResponsiveValue({
    xsmall: 80,
    medium: 160,
  });

  return (
    <>
      <LandingPageHeader />
      <ScrollView>
        <Box height={sectionSpacing} />
        <Hero />
        <Box height={sectionSpacing} />
        <FeaturesIntroHeading />
        <Box height={sectionSpacing} />
        <CalendarSection />
        <Box height={sectionSpacing} />
        <CashflowSection />
        <Box height={sectionSpacing} />
        <ClientSection />
        <Box height={sectionSpacing} />
        <ForBusinessesSection />
        <Box height={sectionSpacing} />
        <TryTodaySection />
        <Box height={sectionSpacing} />
        <Footer />
      </ScrollView>
      <Visible xsmall small>
        <LandingPageBottomNavigationBar />
      </Visible>
    </>
  );
};

LandingPage.path = '';
LandingPage.navigationOptions = {
  title: 'Kedul - Tool for Simple Salon Management',
};
