import Head from "next/head";
import styles from "../../styles/Home.module.css";
import Web3Modal from "web3modal";
import { ethers, providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import { LINKED_TRUST_CONTRACT_ADDRESS, abi } from "../../constants";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { Bar, Line, Scatter, Bubble } from "react-chartjs-2";
import { useRouter } from 'next/router'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function Trust() {
  const router = useRouter();

  const { wallet_connected, new_trust_created } = router.query;


  //connect wallet
  const [walletConnected, setWalletConnected] = useState(false);

  const [connectedAddress, setConnectedAddress] = useState("");

  //loading when waiting for transaction
  const [loading, setLoading] = useState(false);

  const [trustLoaded, setTrustLoaded] = useState(false);
  const [trustParam, setTrustParam] = useState(
    {
      trust_id: "",
      trust_name: "",
      unlock_time: "",
      unlock_price: "",
      creator: ""
  });


  const [beneficiary, setBeneficiaryToAdd] = useState(
    {
      beneficiary: "",
  });

  //*******************************  fix this later
  const [isActiveTrust, setActiveTrust] = useState(true);

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
      let address = await signer.getAddress();
      console.log(address);
      setConnectedAddress(address);
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

  const getTrustStats = async () => {
    const signer = await getProviderOrSigner(true);
    const linkingTrustContract = new Contract(
      LINKED_TRUST_CONTRACT_ADDRESS,
      abi,
      signer
    );
    let parsedID = router.asPath.split('/trust/')[1];
    console.log(`its undefined huh???? ${parsedID}`);
    let trust = await linkingTrustContract.getTrust(parsedID);
    setTrustParam( prevTrustParam => ({...prevTrustParam, trust_id: parsedID}));
    setTrustParam( prevTrustParam => ({...prevTrustParam, trust_name: trust[0]}));
    setTrustParam( prevTrustParam => ({...prevTrustParam, unlock_price: trust[2].toString()}));
    setTrustParam( prevTrustParam => ({...prevTrustParam, creator: trust[3]}));
    let unlock_unix_timestamp = trust[1].toString();
    let date = new Date(unlock_unix_timestamp/1);
    let month = date.getMonth();
    // Minutes part from the timestamp
    let day = date.getDay();
    // Seconds part from the timestamp
    let year = date.getFullYear();
    let hours = date.getHours();
    let half = "AM";
    if (hours > 12) {
      hours -= 12;
      half = "PM";
    }
    let minutes = date.getMinutes();
    let fullData = month + '/' + day +'/' + year + ' ' + hours + ':' + minutes + half;

    setTrustParam( prevTrustParam => ({...prevTrustParam, unlock_time: fullData}));
    setTrustLoaded(true);
  };

  const addBeneficiary = async () => {
    const signer = await getProviderOrSigner(true);
    const linkingTrustContract = new Contract(
      LINKED_TRUST_CONTRACT_ADDRESS,
      abi,
      signer
    );
    let tx = await linkingTrustContract.setBeneficiary(beneficiary.beneficiary, trustParam.trust_id);
    setLoading(true);
    console.log('loading');
    await tx.wait();
    console.log('done');
    setLoading(false);
  };

  const addBeneficiaryButton = () => {
    if(!loading){
      if(trustParam.creator == connectedAddress){
        return (
          <div className={styles.card}>
            <div className={styles.formcontainer}>
            <div className={styles.form}>
              <label title="Add a beneficiary" className={styles.label} for="beneficiary">Beneficiary</label>
              <input className={styles.input} type="text" id="beneficiary" name="beneficiary"
              onChange={e => {
                setBeneficiaryToAdd(prevBeneficiary => ({...prevBeneficiary, beneficiary: e.target.value}));
              }} />
            </div>
            </div>
            <div className={styles.buttonDiv}>
              <button onClick={addBeneficiary}  className={styles.button}>Add</button>
            </div>
          </div>
        );
      } else {
        return (
          <div className={styles.card}>
            <div className={styles.formcontainer}>
              <h2>Beneficiaries</h2>
              <h3>Access denied.</h3>
            </div>
          </div>
        );
      }
    } else {
      return (
        <div className={styles.card}>
          <div className={styles.description}>
            <p className={styles.loading}>Waiting for transaction</p>
          </div>
        </div>
      );
    }


  };

  const data = {
    labels: ["Mon", "Wed", "Fri"],
    datasets: [
      {
        data: [ trustParam.unlock_price, 2, 500],
      },
    ],
  };





  const renderChart = () => {
    const options = {
      plugins: {
        legend: {
          display: false,
        },
      },
      elements: {
        line: {
          tension: 0,
          borderWidth: 2,
          borderColor: "rgba(47, 97, 255, 1)",
          fill: "start",
          backgroundColor: "rgba(47, 97, 255, 0.3)",
        },
        point: {
          radius: 0,
          hitRadius: 0,
        },
      },
      scales: {
        xAxis: {
          display: false,
        },
        yAxis: {
          display: false,
        },
      },
    };

      if (walletConnected) {
        if (!trustLoaded) {
          getTrustStats();
          console.log('loaded trust');
        }
          return (
            <div>
              <Head>
                <title>LinkedTrust</title>
                <meta name="description" content="Decentralized Trust" />
                <link rel="icon" href="/favicon.ico" />
              </Head>
              <div className={styles.container}>
                <div className={styles.card}>
                  <div className={styles.description}>
                    <h3>Name: {trustParam.trust_name}</h3>
                    <p>Unlock Time: {trustParam.unlock_time}</p>
                    <p>Unlock Price: {trustParam.unlock_price}</p>
                    <p>Trust ID: {trustParam.trust_id}</p>
                  </div>
                </div>
                <div className={styles.card}>
                  <Line data={data} className={styles.data} options={options}/>
                </div>
              </div>
              {addBeneficiaryButton()}
            </div>
            );
          } else {
            return (
              <div>
                <Head>
                  <title>LinkedTrust</title>
                  <meta name="description" content="Decentralized Trust" />
                  <link rel="icon" href="/favicon.ico" />
                </Head>

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

  useEffect(() => {
    setTrustLoaded(false);
  }, [router.asPath]);

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
