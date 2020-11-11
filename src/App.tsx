import React, { FormEvent, useEffect, useState } from 'react';
import './css/App.css';
import SignupStyles from './css/SignupAttendee.module.scss';
import AttendeeListStyles from './css/AttendeeList.module.scss';
type email = string;

interface Attendee {
  name: string;
  email: email;
  rsvp: boolean;
}

function AttendeeList({ attendees }: { attendees: Attendee[] }) {
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

const SignupAttendee = ({ onAdded }: { onAdded: (attendee: Attendee) => void }) => {

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [rsvp, setRsvp] = useState<boolean>(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();

    const attendee: Attendee = {
      name, email, rsvp
    }
    onAdded(attendee);
    setName(""); setEmail(""); setRsvp(false)
  }

  return <form onSubmit={submit} className={SignupStyles.form}>
    <div>
      <label htmlFor="name">Name</label>
      <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} />
    </div>
    <div>
      <label htmlFor="email">Email</label>
      <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
    </div>
    <div>
      <label htmlFor="rsvp">I&apos;m coming!</label>
      <input name="rsvp" type="checkbox" checked={rsvp} onClick={() => setRsvp(!rsvp)} />
    </div>
    <button type="submit">Submit</button>
  </form>

}

const App: React.FC = () => {

  const [attendees, setAttendees] = useState<Attendee[]>([]);

  const addAttendee = (attendee: Attendee) => {
    const newAttendees: Attendee[] = [...attendees, attendee];
    localStorage.setItem("attendees", JSON.stringify(newAttendees));
    setAttendees(newAttendees);
  }

  useEffect(() => {
    const storedAttendees = localStorage.getItem("attendees");
    if (storedAttendees) {
      setAttendees(JSON.parse(storedAttendees));
    }
  }, []);

  return (
    <div className="App">
      <header style={{ fontSize: "2em" }}>
        Signup for my Birthday
      </header>
      <main>
        <AttendeeList attendees={attendees} />
        <SignupAttendee onAdded={addAttendee} />
      </main>
    </div>
  );
}

export default App;
