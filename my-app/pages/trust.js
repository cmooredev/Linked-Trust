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

  const {trust_name, unlock_time, unlock_price, trust_id} = router.query;
  let unlock_unix_timestamp = +unlock_time;
  let date = new Date(unlock_unix_timestamp);

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

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);

    } catch (err) {
      console.error(err);
    }
  };


  const renderChart = () => {
    const data = {
        labels: ['Red', 'Blue', 'Yellow'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 0.8)',
              'rgba(54, 162, 235, 0.8)',
              'rgba(255, 206, 86, 0.8)',
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

      return (

        <div>
          <Head>
            <title>LinkedTrust</title>
            <meta name="description" content="Decentralized Trust" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <div className={styles.main}>
            <div className={styles.intro}>
              <div className={styles.description}>
                <p>Name: {trust_name}</p>
                <p>Unlock Time: {date.toLocaleString()}</p>
                <p>Unlock Price: {unlock_price}</p>
                <p>Trust ID: {trust_id}</p>
              </div>
            </div>
            <div>
              <Doughnut data={data} className="styles.data"/>
            </div>
          </div>
        </div>

      );


      // if (!walletConnected) {
      //   if (loading) {
      //     return <div className={styles.loading}><h2>Creating New Trust...</h2></div>;
      //   } else {
      //
      //   }
      // } else {
      //   return (
      //     <button onClick={connectWallet} className={styles.button}>
      //       Connect your wallet
      //     </button>
      //   );
      // }

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
        {renderChart()}
        <canvas id="chart"></canvas>
      </div>
    </div>
  </div>
  );
};
