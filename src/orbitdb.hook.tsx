import OrbitDB from 'orbit-db';
import { useEffect, useState } from "react";
import { useIpfs } from './ipfs.context';

const useOrbitDb = () => {
  const {ipfs} = useIpfs();
  const [odb, setOdb] = useState<any>();

  const newDocsDb = async (name: string) => {
    const db = await odb.docs(name, {
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
    
    await db.load();
    
    return db;
  }

  useEffect(() => {
    if (!ipfs) return;
    (async () => {
      const orbitDb = await OrbitDB.createInstance(ipfs);
      console.log("Identity", orbitDb.identity.toJSON());
      setOdb(orbitDb);
    })();

  }, [ipfs]);

  return {odb, newDocsDb};
}

export {useOrbitDb};