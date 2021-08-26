import { Box, Code, Flex, Heading, Text } from "@chakra-ui/layout";
import React, { useEffect, useState } from "react";
import { useIpfs } from "../ipfs.context";
import { Attendee } from "../types/Attendee";
import AttendeeList from "./AttendeeList/AttendeeList";
import ConnectDb from "./ConnectDb";
import SignupAttendee from "./SignupAttendee/SignupAttendee";

const AttendeeApp = () => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const {ipfs} = useIpfs();

  const [attendeeDb, setAttendeeDb] = useState<any>();

  const reloadAttendees = async () => {
    const atts = await attendeeDb.query((doc: Attendee) => true);
    setAttendees(atts);
  }

  const addAttendee = async (attendee: Attendee) => {
    const hash = await attendeeDb.put(attendee,  { pin: true });
    const dagEntry = await ipfs?.dag.get(hash);
    console.log(hash, dagEntry);

    reloadAttendees();
  }

  const toggleRsvp = async(mail: string) => {
    const atts = await attendeeDb.get(mail);
    if (atts.length === 0) return;
    atts[0].rsvp = !atts[0].rsvp;
    await attendeeDb.put(atts[0]);
    reloadAttendees();
  }

  const deleteAttendee = async(mail: string) => {
    const hash = await attendeeDb.del(mail);
    const dagEntry = await ipfs?.dag.get(hash);
    console.log(hash, dagEntry);
    reloadAttendees();
  }
  
  useEffect(() => {
    if (attendeeDb) {
      attendeeDb.events.on('replicated', () => reloadAttendees());
      reloadAttendees();
    }
  }, [attendeeDb]);


  return (
    <Box my={5}>

      <Heading size="xl" textAlign="center">
        Join this event 
      </Heading>
      <Flex my={5} direction="column" justifyContent="center">
        <ConnectDb onConnected={setAttendeeDb} />
        { attendeeDb && 
          <Box my={3}>
            <Heading size="lg">Attendees</Heading>
            <AttendeeList attendees={attendees} toggleRsvp={toggleRsvp} deleteAttendee={deleteAttendee}/>
            <Heading size="lg">Signup</Heading>
            <SignupAttendee add={addAttendee} />
          </Box>
        }
      </Flex>
    </Box>
  )
}
export default AttendeeApp