import { Button } from "@chakra-ui/button";
import { Checkbox } from "@chakra-ui/checkbox";
import { FormControl, FormHelperText, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box } from "@chakra-ui/layout";
import React, { FormEvent, useState } from "react";
import { Attendee } from "../../types/Attendee";

const DEFAULT_ATTENDEE = {
  name: "",
  email: "",
  rsvp: false
};

const SignupAttendee = ({ add }: { add: (attendee: Attendee) => void }) => {

  const [attendee, setAttendee] = useState<Attendee>(DEFAULT_ATTENDEE)
  const submit = (e: FormEvent) => {
    e.preventDefault();
    add(attendee);
    setAttendee(DEFAULT_ATTENDEE)
  }

  const handler = (field: string) => {
    return (evt: any) => {
      setAttendee(old => {
        return {
          ...old,
          [field]: evt.target.value || evt.target.checked
        }
      })
    }
  }
  return (
    <Box bg="gray.700" p={3} my={5}>
      <form onSubmit={submit}>
        <FormControl id="name">
          <FormLabel>Name</FormLabel>
          <Input variant="filled" type="text" name="name" onChange={handler("name")} value={attendee.name} />
          <FormHelperText></FormHelperText>
        </FormControl>
        <FormControl id="email">
          <FormLabel>Email address</FormLabel>
          <Input variant="filled" name="email" type="email" onChange={handler("email")} value={attendee.email}/>
          <FormHelperText>careful. this will be public</FormHelperText>
        </FormControl>
        <FormControl my={3}>
          <Checkbox name="rsvp" onChange={handler("rsvp")} isChecked={attendee.rsvp}>
            Count me in.
          </Checkbox>
        </FormControl>
        <Button my={5} type="submit" colorScheme="teal">Submit.</Button>
      </form>
    </Box>
  )
}

export default SignupAttendee