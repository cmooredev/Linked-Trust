import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { ethers, providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/router'

export default function About() {
  const router = useRouter();


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
                <p>Welcome</p>
              </div>
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
