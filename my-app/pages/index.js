import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { ethers, providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import { LINKED_TRUST_CONTRACT_ADDRESS, abi } from "../constants";
import { useRouter } from 'next/router';

export default function Home() {

  //next router
  const router = useRouter();

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
      const signer = await getProviderOrSigner(true);
      const linkingTrustContract = new Contract(
        LINKED_TRUST_CONTRACT_ADDRESS,
        abi,
        signer
      );

      const tx = await linkingTrustContract.createNewTrust(
        trustParam.trust_name ,trustParam.unlock_time, trustParam.unlock_price
      );
      setLoading(true);
      linkingTrustContract.on("NewTrust", (trustID, when, creator) => {
        id = trustID.toString();
        setTrustParam( prevTrustParam => ({...prevTrustParam, id}));
        router.push({
          pathname: `/trust/${id}`,
          query: { trust_name: trustParam.trust_name,
                   trust_id : id,
                   unlock_time: trustParam.unlock_time,
                   unlock_price: trustParam.unlock_price,
                   wallet_connected: walletConnected,
                   new_trust_created: newTrustCreated,
          },
        }, `/trust/${id}`)
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
        return (
          <div className={styles.main}>
          <div className={styles.card}>
            <div className={styles.loading}>
              <h2>Creating New Trust</h2>
              <p>Please Wait</p>
            </div>
          </div>
          </div>
        );
      } else {
        return (

          <div className={styles.main}>
            <div className={styles.intro}>
              <h1 className={styles.title}>LinkedTrust!</h1>
              <div className={styles.tagline}>
                A platform for creating decentralized trusts.
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.formcontainer}>
              <div className={styles.form}>
                <label title="Set a name for your trust." className={styles.label} for="name">Trust name</label>
                <input className={styles.input} type="text" id="name" name="name"
                onChange={e => {
                  setTrustParam( prevTrustParam => ({...prevTrustParam, trust_name: e.target.value}));
                }} />
                <label title="Choose the date the beneficiares can access funds." className={styles.label} for="time">Unlock Time</label>
                <input className={styles.input} type="datetime-local" id="time" name="time"
                onChange={e => {
                  let dateToUnix = +new Date(e.target.value);
                  console.log('first ' + dateToUnix);
                  setTrustParam( prevTrustParam => ({...prevTrustParam, unlock_time: dateToUnix }));
                }} />
                <label title="Set an unlock price for the trust. Beneficiaries will be able to partially withdraw funds when trust is above this threshold." className={styles.label} for="price">Unlock Price</label>
                <input className={styles.input} type="text" id="price" name="price"
                onChange={e => {
                  setTrustParam( prevTrustParam => ({...prevTrustParam, unlock_price: e.target.value}));
                }} />
              </div>
              </div>
              <div className={styles.buttonDiv}>
                <button onClick={newTrust} className={styles.button}>Submit</button>
              </div>
            </div>
          </div>

        );
      }
    } else {
      return (
        <div className={styles.main}>
        <h1 className={styles.title}>LinkedTrust</h1>
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
        </div>
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
      {renderTrustForm()}
    </div>
    );
}
