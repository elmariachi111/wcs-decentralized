import IPFS from 'ipfs-core';
import OrbitDB from 'orbit-db';
import React, { FormEvent, useEffect, useState } from 'react';
import './css/App.css';
import AttendeeListStyles from './css/AttendeeList.module.scss';
import SignupStyles from './css/SignupAttendee.module.scss';

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
      <input name="rsvp" type="checkbox" checked={rsvp} onChange={() => setRsvp(!rsvp)} />
    </div>
    <button type="submit">Submit.</button>
  </form>

}

const App: React.FC = () => {

  const [attendees, setAttendees] = useState<Attendee[]>([]);

  const [ipfsNode, setIpfsNode] = useState<any>();
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

  useEffect(() => {
    if (!ipfsNode)
      return;

    (async () => {
      const orbitDb = await OrbitDB.createInstance(ipfsNode);
      const db = await orbitDb.docs('orbit.users.birthday.1', {
        indexBy: 'email',
        accessController: {
          write: ['*'] // Give write access to everyone
        }
      })
      db.events.on('replicate', (address: string) => console.debug("replicate", address))
      db.events.on('replicated', (address: string) => console.log("replicated", address))
      db.events.on('replicate.progress', (address: string) => console.debug("replicate.progress", address))
      db.events.on('load', (dbname: string) => console.debug("start loading", dbname))
      db.events.on('ready', (dbname: string) => console.log("ready", dbname))
      db.events.on('replicated', () => reloadAttendees(db));

      await db.load();
      setAttendeeDb(db);
    })();

  }, [ipfsNode]);

  useEffect(() => {
    (async () => {

      const ipfs = await IPFS.create({
        config: {
          Addresses: {
            Swarm: ['/dns4/ipfs.depa.digital/tcp/9091/wss/p2p-webrtc-star'],
          },
        }
      });
      setIpfsNode(ipfs);

    })();
  }, [])
  return (
    <div className="App">
      <header>
        Signup for my Birthday
        {attendeeDb && <small>{attendeeDb.address.toString()}</small>}
      </header>
      <main>
        <AttendeeList attendees={attendees} />
        <SignupAttendee onAdded={addAttendee} />
      </main>
    </div>
  );
}

export default App;
