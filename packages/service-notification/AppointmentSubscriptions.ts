import { subscribe } from '@kedul/common-server';
import { Appointment } from '@kedul/service-appointment';
import { sendAppointmentCreatedByClientForClient } from '@kedul/service-phone';

subscribe<Appointment>('APPOINTMENT_CREATED_BY_CLIENT', props => {
  const { data: appointment, context } = props;
  //

  if (!appointment.reference) throw new Error(`Expected appointment reference`);

  sendAppointmentCreatedByClientForClient(
    '',
    {
      appointmentDate: appointment.services[0].startDate,
      appointmentReference: appointment.reference,
      businessName: '',
    },
    context,
  );
});

subscribe<Appointment>('APPOINTMENT_CREATED_BY_MEMBER', props => {
  //
});

subscribe<Appointment>('APPOINTMENT_CANCELED_BY_CLIENT', props => {
  //
});

subscribe<Appointment>('APPOINTMENT_CANCELED_BY_MEMBER', props => {
  //
});

subscribe<Appointment>('APPOINTMENT_UPDATED_BY_CLIENT', props => {
  //
});

subscribe<Appointment>('APPOINTMENT_UPDATED_BY_MEMBER', props => {
  //
});
