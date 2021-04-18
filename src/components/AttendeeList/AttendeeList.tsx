import React from 'react';
import { Attendee } from '../../types/Attendee';
import AttendeeListStyles from './AttendeeList.module.scss';

const AttendeeList = ({ attendees }: { attendees: Attendee[] }) => {
  return (
    <ul className={AttendeeListStyles.ul}>
      {attendees.map(
        (attendee: Attendee, idx: number) => (
          <li key={`attendee-${idx}`}>
            <p>
              <b>{attendee.name}</b><br />
              <i>{attendee.email}</i><br />
              <span>{attendee.rsvp ? "coming" : "skipping"}</span>
            </p>
          </li>
        ))}
    </ul >
  )
}

export default AttendeeList