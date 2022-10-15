import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import { LINKED_TRUST_CONTRACT_ADDRESS, abi } from "../constants";

export default function Home() {

  //connect wallet
  const [walletConnected, setWalletConnected] = useState(false);

  //keep track of creating new trusts
  const [newTrustCreated, setNewTrustCreated] = useState(false);


  //loading when waiting for transaction
  const [loading, setLoading] = useState(false);

  //create ref to web3 web3modal
  const web3ModalRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Switch to Goerli");
      throw new Error("Change to Goerli");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  const newTrust = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const linkingTrustContract = new Contract(
        LINKED_TRUST_CONTRACT_ADDRESS,
        abi,
        signer
      );

      const tx = await linkingTrustContract.createNewTrust(1000000000000, 1, "0xdfFA7d99A0C0DCF059C4a3E5c47AA9B90aAb2a1d", "0xdfFA7d99A0C0DCF059C4a3E5c47AA9B90aAb2a1d");
      setLoading(true);
      await tx.wait();
      setLoading(false);
      setNewTrustCreated(true);
    } catch (err) {
      console.error(err);
    }
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);

    } catch (err) {
      console.error(err);
    }
  };

  const renderButton = () => {
    if (walletConnected) {
      if (newTrustCreated) {
        return (
          <div className={styles.description}>
            New trust created.
          </div>
        );
      } else if (loading) {
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
          <div className={styles.form}>
          <form>
            <label className={styles.label} for="name">Trust name:</label>
            <input className={styles.input} type="text" id="name" name="name" />
            <label className={styles.label} for="date">Unlock Date:</label>
            <input className={styles.input} type="text" id="date" name="date" />
            <label className={styles.label} for="price">Unlock Price:</label>
            <input className={styles.input} type="text" id="price" name="price" />
            <label className={styles.label} for="authOne">Authorized User:</label>
            <input className={styles.input} type="text" id="authOne" name="authOne" />
            <label className={styles.label} for="authTwo">Authorized User:</label>
            <input className={styles.input} type="text" id="authTwo" name="authTwo" />
            <button onClick={newTrust} className={styles.submit}>Submit</button>
          </form>
          </div>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);



  return (
  <div>
    <Head>
      <title>LinkedTrust</title>
      <meta name="description" content="Decentralized Trust" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className={styles.main}>
      <div>
        <h1 className={styles.title}>Welcome to LinkedTrust!</h1>
        <div className={styles.description}>
          A platform for creating decentralized trusts.
        </div>
        {renderButton()}
      </div>
    </div>

    <footer className={styles.footer}>
      Made with &#10084; by cmoorelabs
    </footer>
  </div>
  );
}
