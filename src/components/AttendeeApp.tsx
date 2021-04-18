import React from "react";
import { useEffect, useState } from "react";
import { useOrbitDb } from "../orbitdb.hook";
import { Attendee } from "../types/Attendee";
import AttendeeList from "./AttendeeList/AttendeeList";
import SignupAttendee from "./SignupAttendee/SignupAttendee";

const AttendeeApp = () => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  
  const {newDocsDb} = useOrbitDb();
  const [attendeeDb, setAttendeeDb] = useState<any>();

  const addAttendee = async (attendee: Attendee) => {
    const hash = await attendeeDb.put(attendee);
    console.log(hash);
    reloadAttendees(attendeeDb);
  }

  const reloadAttendees = async (db: any) => {
    const atts = await db.query((doc: Attendee) => true);
    setAttendees(atts);
  }

  useEffect(() => {
    if (attendeeDb) {
      reloadAttendees(attendeeDb);
    }
  }, [attendeeDb]);

  const connect = async () => {
    const db = await newDocsDb('orbit.users.birthday')
    db.events.on('replicated', () => reloadAttendees(db));
    setAttendeeDb(db);
  }
  return (
    <>
    <header>
      Signup for my Birthday 
      { !attendeeDb && <button onClick={connect}>connect</button>}
      {attendeeDb && <small>{attendeeDb.address.toString()}</small>}
    </header>
    {attendeeDb &&
      <main>
        <AttendeeList attendees={attendees} />
        <SignupAttendee onAdded={addAttendee} />
      </main>
    }
  </>
  )
}
export default AttendeeApp