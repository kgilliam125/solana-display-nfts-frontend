import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { FC, useEffect, useState } from "react";
import styles from "../styles/custom.module.css";

export const FetchNft: FC = () => {
  const [nftData, setNftData] = useState(null);
  const wallet = useWallet();
  const { connection } = useConnection();

  const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet));

  const fetchNfts = async () => {
    if (!wallet.connected) {
      // alert("connect your wallet");
      return;
    }

    const nfts = await metaplex
      .nfts()
      .findAllByOwner({ owner: wallet.publicKey })
      .run();

    let data = [];
    for (let i = 0; i < nfts.length; i++) {
      let fetchResult = await fetch(nfts[i].uri);
      let json = await fetchResult.json();

      data.push(json);
    }

    setNftData(data);
  };

  useEffect(() => {
    fetchNfts();
  }, [wallet]);

  return (
    <div>
      {nftData && (
        <div className={styles.gridNFT}>
          {nftData.map((nft) => (
            <div>
              <ul>{nft.name}</ul>
              <img src={nft.image} alt="" />
              <ul>{nft.attributes.map((a) =>(
                <li>`${a.trait_type} : ${a.value}`</li>
              ))}</ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
