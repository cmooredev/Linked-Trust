import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { ethers, providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import { LINKED_TRUST_CONTRACT_ADDRESS, abi } from "../constants";
import { useRouter } from 'next/router';

export default function Home() {

  //next router
  const router = useRouter()

  //connect wallet
  const [walletConnected, setWalletConnected] = useState(false);

  //keep track of creating new trusts
  const [newTrustCreated, setNewTrustCreated] = useState(false);

  //keep track of trust values
  const [trustParam, setTrustParam] = useState(
    {
      trust_name: "",
      unlock_time: "",
      unlock_price: "",
      auth_one: "",
      auth_two: "",
      trust_id: ""
  });

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

  const newTrust = async (e) => {
    let id = '';
    try {
      console.log(`${trustParam.auth_one}`);
      const signer = await getProviderOrSigner(true);
      const linkingTrustContract = new Contract(
        LINKED_TRUST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      console.log(trustParam.unlock_time);
      const tx = await linkingTrustContract.createNewTrust(
        trustParam.unlock_time, trustParam.unlock_price, trustParam.auth_one, trustParam.auth_two
      );
      setLoading(true);
      linkingTrustContract.on("NewTrust", (trustID, when, creator) => {
        id = trustID.toString();
        setTrustParam( prevTrustParam => ({...prevTrustParam, id}));
        router.push({
          pathname: '/trust',
          query: { trust_name: trustParam.trust_name,
                   trust_id : id,
                   unlock_time: trustParam.unlock_time,
                   unlock_price: trustParam.unlock_price,
                   auth_one: trustParam.auth_one,
                   auth_two: trustParam.auth_two,
          }
        }, '/trust')
      });
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

  const renderTrustForm = () => {
    if (walletConnected) {
      if (loading) {
        return <div className={styles.loading}><h2>Creating New Trust...</h2></div>;
      } else {
        return (
          <div>
            <div className={styles.form}>
              <label className={styles.label} for="name">Trust name:</label>
              <input className={styles.input} type="text" id="name" name="name"
              onChange={e => {
                setTrustParam( prevTrustParam => ({...prevTrustParam, trust_name: e.target.value}));
              }} />
              <label className={styles.label} for="time">Unlock Time:</label>
              <input className={styles.input} type="text" id="time" name="time"
              onChange={e => {
                setTrustParam( prevTrustParam => ({...prevTrustParam, unlock_time: e.target.value}));
              }} />
              <label className={styles.label} for="price">Unlock Price:</label>
              <input className={styles.input} type="text" id="price" name="price"
              onChange={e => {
                setTrustParam( prevTrustParam => ({...prevTrustParam, unlock_price: e.target.value}));
              }} />
              <label className={styles.label} for="authOne">Authorized User:</label>
              <input className={styles.input} type="text" id="authOne" name="authOne"
              onChange={e => {
                setTrustParam( prevTrustParam => ({...prevTrustParam, auth_one: e.target.value}));
              }} />
              <label className={styles.label} for="authTwo">Authorized User:</label>
              <input className={styles.input} type="text" id="authTwo" name="authTwo"
              onChange={e => {
                setTrustParam( prevTrustParam => ({...prevTrustParam, auth_two: e.target.value}));
              }} />
            </div>
            <div className={styles.buttonDiv}>
              <button onClick={newTrust} className={styles.submit}>Submit</button>
            </div>
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
        {renderTrustForm()}
        <canvas id="chart"></canvas>
      </div>
    </div>

    <footer className={styles.footer}>
      Made with &#10084; by cmoorelabs
    </footer>
  </div>
  );
}
