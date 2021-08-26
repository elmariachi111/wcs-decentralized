import React, {FormEvent, useState} from 'react'
import { Button } from "@chakra-ui/button"
import { FormControl, FormHelperText, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { useOrbitDb } from "../orbitdb.hook";
import { Box, Code, Flex, Text } from '@chakra-ui/layout';

const ConnectDb = ({ onConnected }: {
  onConnected: (db: any) => void
}) => {

  const [dbName, setDbName] = useState<string>('picnic');
  const {odb, newDocsDb} = useOrbitDb();
  const [db, setDb] = useState<any>();

  const connect = (e: FormEvent) => {
    e.preventDefault();
    (async() => {
      const db = await newDocsDb(`wcs.orbit.${dbName}`);
      setDb(db);
      onConnected(db);
    })()
  }

  return (
    <Box bg="gray.700" p={3} my={5}>
      <form onSubmit={connect}>
        <Flex direction="row" align="flex-end">
          <FormControl id="name">
            <FormLabel>DB Name</FormLabel>
            <Flex align="center" gridGap={2}>
              <Text>
                wcs.orbit.
              </Text>
              <Input variant="filled" type="text" name="dbname" onChange={(e) => setDbName(e.target.value)} value={dbName} />
            </Flex>
            
            <FormHelperText></FormHelperText>
          </FormControl>
          <Button type="submit" colorScheme="teal" m={2}>connect</Button>
        </Flex>
      </form>
      { db && <Box>
        <Text size="sm" mr={3} >connected to: </Text>
        <Text p={2} isTruncated fontFamily="monospace">
          {db.address.toString()}
        </Text>
        
        </Box>
      }
    </Box>
  )
}

export default ConnectDb

