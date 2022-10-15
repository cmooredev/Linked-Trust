import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { ethers, providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import { LINKED_TRUST_CONTRACT_ADDRESS, abi } from "../constants";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Home() {

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
        console.log(trustID.toString(), when.toString(), creator);
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
      if (newTrustCreated) {
        return (
          <div className={styles.description}>
            New trust created.
            Name
            <p>{trustParam.trust_name}</p>
            Time
            <p>{trustParam.unlock_time}</p>
          </div>
        );
      } else if (loading) {
        return <button className={styles.button}>Loading...</button>;
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

  const renderChart = () => {
    const data = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };

      return (<Doughnut data={data}/>);
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
        {renderChart()}
        <canvas id="chart"></canvas>
      </div>
    </div>

    <footer className={styles.footer}>
      Made with &#10084; by cmoorelabs
    </footer>
  </div>
  );
}
