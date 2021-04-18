import { IconButton } from '@chakra-ui/button';
import { CheckIcon, CloseIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, Flex, Spacer, Text, VStack } from '@chakra-ui/layout';
import React from 'react';
import { Attendee } from '../../types/Attendee';

const AttendeeList = ({ attendees, deleteAttendee, toggleRsvp }: { 
  attendees: Attendee[],
  deleteAttendee: (mail: string) => Promise<void>,
  toggleRsvp: (mail: string) => Promise<void>
}) => {

  return (
    <VStack spacing={3} my={5}>
      {attendees.map(
        (attendee: Attendee, idx: number) => (
          <Flex direction="row" w="100%" alignItems="center" key={`attendee-${idx}`}>
            <Flex direction="row"
              alignItems="center"
              w="100%"
              bg={attendee.rsvp ? 'green.800' : 'red.800'}
             borderWidth="1px" borderRadius="lg">
              <Flex direction="column" p={3}>
                <Text fontWeight="bold" size="lg">
                  {attendee.name}
                </Text>
                <Text size="sm">{attendee.email}</Text>
              </Flex>
              <Spacer />
              <Box p={5} onClick={() => toggleRsvp(attendee.email)}>
                {attendee.rsvp ? <CheckIcon color="green.600" /> : <CloseIcon color="red.600" />}
              </Box>
            </Flex>
            <IconButton icon={<DeleteIcon />}  mx={5} aria-label="delete" onClick={() => deleteAttendee(attendee.email)} />
          </Flex>
        ))}
    </VStack>
  )
}

export default AttendeeList