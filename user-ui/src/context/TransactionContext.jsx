import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { contractABI, contractAddress } from "../utils/constants";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
export const TransactionContext = React.createContext();

const { ethereum } = window;

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

  console.log('ipcontract', transactionsContract);
  return transactionsContract;
};

export const TransactionsProvider = ({ children }) => {
  const [formParams, updateFormParams] = useState({ IPname: '', description: '', fullname: '', country: '', street: '' });
  const [mydata, updatemyData] = useState([]);
  const [mydets, updateDetails] = useState([]);
  const [message, updateMessage] = useState('');
  const [textmessage, setupMessage] = useState('');
  const [nfts, updateData] = useState('');
  const [formData, setformData] = useState({ user: "", IPname: "", fullname: "", country: "", addressplace: "", symbol: "" });
  const [bidformData, setbidformData] = useState({ address: "", ownerIPname: "", bidvalue: "", bidderaddress: "" });
  const [currentAccount, setCurrentAccount] = useState("");
  const [datas, getMembers] = useState([]);
  const [bidData, getbidders] = useState([]);
  const [accept, acceptCounts] = useState("");
  const [reject, rejectCounts] = useState("");
  const [pend, pendCounts] = useState("");
  const [countbids, bidsCounts] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const handleChanges = (e, name) => {
    setbidformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) return setupMessage("Please install MetaMask.");
      const accounts = await ethereum.request({ method: "eth_accounts" });
      //window.location.reload();
      console.log(accounts);
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        //getAllTransactions();
        console.log("accounts found");
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfTransactionsExists = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();
        console.log('Connect to your sepolia metamask account!');
        //const currentTransactionCount = await transactionsContract.countEmployees();
        //setTransactionCount(currentTransactionCount);
        //window.localStorage.setItem("transactionCount", currentTransactionCount);
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return setupMessage("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_requestAccounts", });
      setCurrentAccount(accounts[0]);
      setupMessage('You are Connected!');
      window.location.reload();
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  // const registerIP= async (user, IPname, fullname, country, addressplace, symbol) => {
  //   try {  
  //     if (ethereum) {
  //       //const { user, IPname, fullname, country, addressplace, symbol } = formData;
  //       const transactionsContract = createEthereumContract();

  //       const transactionHash = await transactionsContract.setIP(user, IPname, fullname, country, addressplace, symbol);

  //       setIsLoading(true);
  //       console.log(`Loading - ${transactionHash.hash}`);
  //       await transactionHash.wait();
  //       console.log(`Success - ${transactionHash.hash}`);
  //       setIsLoading(false);

  //       //const transactionsCount = await transactionsContract.countEmployees();

  //       //setTransactionCount(transactionsCount.toNumber());
  //       window.location.reload();
  //       console.log('success')
  //     } else {
  //       console.log("No ethereum object now");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error("No ethereum object");
  //   }
  // };

  const updateCommission = async (value) => {
    let price = value.toString()
    const transactionsContract = createEthereumContract();
    const acceptCount = await transactionsContract.updateCommissionFee(price);
  };

  // ///////////////////////////////////////////////////////////
  //This function uploads the metadata to IPFS
  async function uploadMetadataToIPFS(fileURL) {
    const { IPname, description, fullname, country, street } = formParams;
    // console.log("get",IPname);
    // console.log("this",fileURL);
    //Make sure that none of the fields are empty
    if (!IPname || !description || !fullname || !country || !street || !fileURL)
      return;

    const nftJSON = {
      IPname, description, fullname, country, street, image: fileURL
    }

    try {
      //upload the metadata JSON to IPFS
      const response = await uploadJSONToIPFS(nftJSON);
      if (response.success === true) {
        console.log("Uploaded JSON to Pinata: ", response)
        return response.pinataURL;
      }
    }
    catch (e) {
      setupMessage("Error with loading");
      console.log("error uploading JSON metadata:", e)
    }
  }

  async function listNFT(fileURL) {
    //e.preventDefault();
    const { IPname, description, fullname, country, street } = formParams;
    console.log("spooon", formParams);
    console.log("forrk", fileURL); uploadMetadataToIPFS(fileURL)
    //Upload data to IPFS
    try {
      if (ethereum) {
        const metadataURL = await uploadMetadataToIPFS(fileURL);
        const transactionsContract = createEthereumContract();

        // //After adding your Hardhat network to your metamask, this code will get providers and signers
        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        // const signer = provider.getSigner();
        updateMessage("Please wait.. uploading (upto 5 mins)")

        //massage the params to be sent to the create NFT request
        //const price = ethers.utils.parseUnits(formParams.price, 'ether')

        //let listingPrice = await transactionsContract.getListPrice()
        //listingPrice = listingPrice.toString()

        //actually create the NFT
        //let transaction = await transactionsContract.createToken(metadataURL, { value: listingPrice })
        let transaction = await transactionsContract.createToken(metadataURL)
        await transaction.wait()

        setupMessage("Successfully listed your NFT!");
        updateMessage("successfully added nft");
        //updateFormParams({ name: '', description: '', price: ''});
        window.location.replace("/ips")
      } else { console.log("No ethereum object now"); }
    }
    catch (e) {
      console.log("Upload error" + e);
      setupMessage("Error with loading");
    }
  }
  const [dataFetched, updateFetched] = useState(false);

  const epochTohumanReadble = (timestamp) => {
    let date = new Intl.DateTimeFormat('en-US',
      {
        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute:
          '2-digit', second: '2-digit'
      }).format(timestamp * 1000)
    return date;
  }

  async function getAllNFTs() {
    try {
      if (ethereum) {
        //Pull the deployed contract instance
        const transactionsContract = createEthereumContract();
        //create an NFT Token
        let transaction = await transactionsContract.getAllNFTs()

        //Fetch all the details of every NFT from the contract and display
        const items = await Promise.all(transaction.map(async i => {
          const tokenURI = await transactionsContract.tokenURI(i.tokenId);
          let meta = await axios.get(tokenURI);
          meta = meta.data;
          // IPname, description, fullname, country, street
          let item = {
            tokenId: i.tokenId.toNumber(),
            Nftowner: i.Nftowner,
            timestamp: epochTohumanReadble(parseInt(i.timestamp['_hex'])),
            status: i.status,
            image: meta.image,
            IPname: meta.IPname,
            description: meta.description,
            fullname: meta.fullname,
            country: meta.country,
            street: meta.street
          }
          return item;
        }))
        console.log("fetching data", items)
        updateFetched(true);
        updateData(items);
        if (items) { setupMessage(''); }
        setIsLoading(false);
      } else {
        console.log("Error with loading");
        setupMessage("Error with loading");
      }
    }
    catch (e) {
      console.log("Upload error" + e);
      setupMessage("Error with loading");
    }
  }

  useEffect(() => {
    if (!dataFetched) {
      getAllNFTs(); // Call the function once
      updateFetched(true); // Set the fetched data state to true to avoid calling again
    }
  }, [dataFetched, getAllNFTs]); // Add getAllNFTs to dependencies
 // This dependency ensures `getAllNFTs` runs only once unless `dataFetched` changes


  async function getNFTData() {
    try {
      if (ethereum) {
        let sumPrice = 0;
        const transactionsContract = createEthereumContract();
        //Pull the deployed contract instance
        let transaction = await transactionsContract.getMyNFTs()
        const items = await Promise.all(transaction.map(async i => {
          const tokenURI = await transactionsContract.tokenURI(i.tokenId);
          let meta = await axios.get(tokenURI);
          meta = meta.data;
          //let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
          let item = {
            tokenId: i.tokenId.toNumber(),
            Nftowner: i.Nftowner,
            timestamp: epochTohumanReadble(parseInt(i.timestamp['_hex'])),
            status: i.status,
            image: meta.image,
            IPname: meta.IPname,
            description: meta.description,
            fullname: meta.fullname,
            country: meta.country,
            street: meta.street
          }
          return item;

        }))
        updatemyData(items);
      } else { console.log("No ethereum object now"); }
    }
    catch (e) {
      console.log("Upload error" + e)
      setupMessage("Error with loading")
    }
  }

  async function getTokenDetails(tokenId) {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();
        //Pull the deployed contract instance
        let transaction = await transactionsContract.idToListedToken(tokenId)

        const tokenURI = await transactionsContract.tokenURI(tokenId);
        let meta = await axios.get(tokenURI);
        meta = meta.data;
        let item = {
          tokenId: transaction.tokenId.toNumber(),
          Nftowner: transaction.Nftowner,
          timestamp: epochTohumanReadble(parseInt(transaction.timestamp['_hex'])),
          status: transaction.status,
          image: meta.image,
          IPname: meta.IPname,
          description: meta.description,
          fullname: meta.fullname,
          country: meta.country,
          street: meta.street
        }
        updateDetails(item);
        return item;

      } else { console.log("No ethereum object now"); }
    }
    catch (e) {
      console.log("Upload error" + e)
      setupMessage("Error with loading")
    }
  }


  const changeStatus = async (id, val) => {
    // console.log('success',id,val)
    try {
      if (ethereum) {
        //const { id, val } = statusformData;
        const transactionsContract = createEthereumContract();
        const transactionHash = await transactionsContract.changeStatus(id, val);
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);

        //  window.location.reload();
        updateMessage("Nft status changed successfully");
        console.log('success')
      } else {
        console.log("Execution Reverted");
      }
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };


  const AcceptBid = async (tokenId, bidderAddress, amount) => {
    console.log('success', tokenId, bidderAddress, amount)

    try {
      if (ethereum) {
        //const { id, val } = statusformData;
        const transactionsContract = createEthereumContract();
        const transactionHash = await transactionsContract.executeSale(tokenId, bidderAddress, { value: ethers.utils.parseEther(amount) });
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);

        //  window.location.reload();
        updateMessage("success");
        console.log('success')
      } else {
        console.log("No ethereum object now");
      }
    } catch (error) {
      console.log(error);
      throw new Error("Execution Reverted, due to minimum gas limit");
    }
  };


  const countAccepted = async () => {
    const transactionsContract = createEthereumContract();
    const acceptCount = await transactionsContract.countAcceptedIPs();
    let bal = acceptCount['_hex'];
    let val = parseInt(bal)
    console.log('accepted count info', val);
    acceptCounts(val);
  };

  const countRejected = async () => {
    const transactionsContract = createEthereumContract();
    const rejectCount = await transactionsContract.countRejectedIPs();
    let bal = rejectCount['_hex'];
    let val = parseInt(bal)
    console.log('rejected count info', val);
    rejectCounts(val);
  };

  const countPend = async () => {
    const transactionsContract = createEthereumContract();
    const pendCount = await transactionsContract.countPendingIPs();
    let bal = pendCount['_hex'];
    let val = parseInt(bal)
    console.log('pending count info', val);
    pendCounts(val);
  };

  // const countbidders = async (address) => {
  //   const transactionsContract = createEthereumContract();
  //   const acceptCount = await transactionsContract.countBids(address);
  //   let bal = acceptCount['_hex'];
  //   let val = parseInt(bal)
  //   console.log('accepted count info',val);
  //   bidsCounts(val);
  // };


  useEffect(() => {
    checkIfWalletIsConnect();
    checkIfTransactionsExists();
    // getNFTData(1);
    // handleWalletBalance()
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        handleChange,
        updateCommission,
        getAllNFTs,
        AcceptBid,
        nfts,
        listNFT,
        message,
        changeStatus,
        getNFTData,
        mydata,
        formParams,
        updateFormParams,
        formData,
        datas,
        countAccepted,
        accept,
        countRejected,
        reject,
        countPend,
        pend,
        handleChanges,
        bidformData,
        bidData,
        countbids,
        isLoading,
        textmessage,
        setupMessage,
        getTokenDetails,
        mydets,
        updateDetails
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}