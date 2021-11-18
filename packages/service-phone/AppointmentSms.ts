import { RequestContext } from '@kedul/common-server';

import { sendSms } from './SmsSender';

export interface AppointmentSmsDataBase {
  appointmentReference: string;
  appointmentDate: Date;
}

export interface AppointmentCreatedByClientForClientSmsData
  extends AppointmentSmsDataBase {
  businessName: string;
}

export const sendAppointmentCreatedByClientForClient = async (
  phoneNumber: string,
  data: AppointmentCreatedByClientForClientSmsData,
  context: RequestContext,
) => {
  const { appointmentDate, appointmentReference, businessName } = data;
  const { i18n } = context.dependencies;

  await sendSms({
    text: i18n.t(
      `You successfully booked an appointment (reference {{appointmentReference}}) with {{businessName}} on {{appointmentDate}}`,
      {
        appointmentDate,
        appointmentReference,
        businessName,
        lng: context.locale,
      },
    ),
    to: phoneNumber,
  });
};

export interface AppointmentCreatedByClientForMemberSmsData
  extends AppointmentSmsDataBase {
  clientFirstName: string;
  locationName: string;
  locationPhone: string;
  serviceName: string;
}
