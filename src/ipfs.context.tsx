import {IPFS, create} from "ipfs-core";
import React, { useContext, useEffect, useState } from "react";

type IPFSContext = {
  ipfs?: IPFS
}
const IPFSContext = React.createContext<IPFSContext>({
  ipfs: undefined
})

const useIpfs = () => useContext(IPFSContext);

const IPFSProvider = ({ children }: {
  children: React.ReactNode
}) => {
  const [ipfsNode, setIpfsNode] = useState<IPFS|undefined>();

  useEffect(() => {
    (async () => {
      const ipfs = await create({
        relay: {
          enabled: true, hop: { enabled: true, active: true }
        },
        config: {
          Discovery: {
            MDNS: {
              Enabled: false,
            },
            webRTCStar: {
              Enabled: true,
            },
          },
          Addresses: {
            Swarm: ['/dns4/ipfs.depa.digital/tcp/9091/wss/p2p-webrtc-star'],
          },
        }
      });
      const ipfsId = await ipfs.id();
      console.log('ipfs node (v%s) is running [id: %s]', ipfsId.agentVersion, ipfsId.id);
      setIpfsNode(ipfs);
    })();
  }, [])

  return (
    <IPFSContext.Provider value={{
      ipfs: ipfsNode
    }}>
      {ipfsNode ? children : <div>starting ipfs</div>}
    </IPFSContext.Provider>
  );
  
}

export {useIpfs, IPFSProvider};