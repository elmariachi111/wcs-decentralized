import { Button } from "@chakra-ui/button";
import { Box, Code, Flex, Heading, Text } from "@chakra-ui/layout";
import React from "react";
import { useEffect, useState } from "react";
import { useOrbitDb } from "../orbitdb.hook";
import { Attendee } from "../types/Attendee";
import AttendeeList from "./AttendeeList/AttendeeList";
import SignupAttendee from "./SignupAttendee/SignupAttendee";

const AttendeeApp = () => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  
  const {odb, newDocsDb} = useOrbitDb();
  const [attendeeDb, setAttendeeDb] = useState<any>();

  const reloadAttendees = async () => {
    const atts = await attendeeDb.query((doc: Attendee) => true);
    setAttendees(atts);
  }

  const addAttendee = async (attendee: Attendee) => {
    const hash = await attendeeDb.put(attendee);
    console.log(hash);
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
    await attendeeDb.del(mail);
    reloadAttendees();
  }
  
  useEffect(() => {
    if (attendeeDb) {
      attendeeDb.events.on('replicated', () => reloadAttendees());
      reloadAttendees();
    }
  }, [attendeeDb]);

  useEffect(() => {
    if (!odb) return;
    (async() => {
      const db = await newDocsDb('orbit.users.birthday')
      setAttendeeDb(db);
    })()
  }, [odb])

  const connect = () => { }
  return (
    <Box my={5}>
    <Heading size="xl" textAlign="center">
      Signup for my Birthday 
    </Heading>
    <Flex my={5} justifyContent="center">
    { attendeeDb ?
      <Flex direction="column">
        <Text size="sm" mr={3} whiteSpace="nowrap">connected to: </Text>
        <Code p={2}>{attendeeDb.address.toString()}</Code>
      </Flex>
      : 
      <Button onClick={connect}>connect</Button>
    }
    </Flex>

    {attendeeDb &&
      <main>
        <Heading size="lg">Attendees</Heading>
        <AttendeeList attendees={attendees} toggleRsvp={toggleRsvp} deleteAttendee={deleteAttendee}/>
        <Heading size="lg">Signup</Heading>
        <SignupAttendee add={addAttendee} />
      </main>
    }
  </Box>
  )
}
export default AttendeeApp