import React, {FormEvent, useState} from 'react'
import { Button } from "@chakra-ui/button"
import { FormControl, FormHelperText, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { useOrbitDb } from "../orbitdb.hook";
import { Box, Code, Flex, Text } from '@chakra-ui/layout';

const ConnectDb = ({ onConnected }: {
  onConnected: (db: any) => void
}) => {

  const [dbName, setDbName] = useState<string>('orbit.users.birthday');
  const {odb, newDocsDb} = useOrbitDb();
  const [db, setDb] = useState<any>();

  const connect = (e: FormEvent) => {
    e.preventDefault();
    (async() => {
      const db = await newDocsDb(dbName);
      setDb(db);
      onConnected(db);
    })()
  }

  return (
    <Box bg="gray.700" p={3} my={5}>
      <form onSubmit={connect}>
        <Flex direction="row" align="end">
          <FormControl id="name">
            <FormLabel>DB Name</FormLabel>
            <Input variant="filled" type="text" name="dbname" onChange={(e) => setDbName(e.target.value)} value={dbName} />
            <FormHelperText></FormHelperText>
          </FormControl>
          <Button type="submit" colorScheme="teal" m={2}>connect</Button>
        </Flex>
      </form>
      { db && <>
          <Text size="sm" mr={3} whiteSpace="nowrap">connected to: </Text>
          <Code p={2}>{db.address.toString()}</Code>
        </>
      }
    </Box>
  )
}

export default ConnectDb

