import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { ethers, providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import { LINKED_TRUST_CONTRACT_ADDRESS, abi } from "../constants";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import { useRouter } from 'next/router'

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Trust() {
  const router = useRouter();

  const {trust_name, unlock_time, unlock_price, auth_one, auth_two, trust_id} = router.query;
  console.log(`ok here we are ${unlock_time}`)
  let unlock_unix_timestamp = +unlock_time;
  let date = new Date(unlock_unix_timestamp);
  console.log(date.toLocaleString());

  //connect wallet
  const [walletConnected, setWalletConnected] = useState(false);

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


  const renderChart = () => {
    const data = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };

      return (<Doughnut data={data}/>);
  };

  return (
  <div>
    <Head>
      <title>LinkedTrust</title>
      <meta name="description" content="Decentralized Trust" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className={styles.main}>
      <div>
        <h1 className={styles.title}>LinkedTrust</h1>
        <div className={styles.description}>
          <p>Name: {trust_name}</p>
          <p>Unlock Time: {date.toLocaleString()}</p>
          <p>Unlock Price: {unlock_price}</p>
          <p>Trust ID: {trust_id}</p>
        </div>
        {renderChart()}
        <canvas id="chart"></canvas>
      </div>
    </div>

    <footer className={styles.footer}>
      Made with &#10084; by cmoorelabs
    </footer>
  </div>
  );
};
