import React from "react";
import { FormEvent, useState } from "react";
import { Attendee } from "../../types/Attendee";
import SignupStyles from './SignupAttendee.module.scss';

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
      <input type="text" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
    </div>
    <div>
      <label htmlFor="rsvp">I&apos;m coming!</label>
      <input name="rsvp" type="checkbox" checked={rsvp} onChange={() => setRsvp(!rsvp)} />
    </div>
    <button type="submit">Submit.</button>
  </form>

}

export default SignupAttendee