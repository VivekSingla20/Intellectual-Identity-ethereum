import React, { useState, useContext, useEffect } from "react";
import { FaHourglass, FaPlus } from "react-icons/fa";
// import Getips from '../../components/Getips.jsx';
import { NavLink } from "react-router-dom";
import '../../css/App.css';
import { TransactionContext } from '../../context/TransactionContext';

const Ip = () => {
  const { datas, getAllIps, connectWallet, countAccepted, accept, countRejected, reject, countPend, pend } = useContext(TransactionContext);
  const[show, setShow] = useState(true);
  
  useEffect(()=>{
    getAllIps();
    countAccepted();
    countRejected();
    countPend();
  },[]);
  function vals (valk){
    const val = parseInt(valk);
    let result = epochTohumanReadble(val)
    return result;
  }
  const epochTohumanReadble = (timestamp) => {        
    let epoch = timestamp;
    let currentTimestamp = epoch;
    let date = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(currentTimestamp)
   // let time =  date.split(' ')[1];
    return date;
   // console.log('timt',time)
  //  const [hour, minute, second] = time.split(':');        
  }

  function status (statusNumber) {
    if(statusNumber === 0){
     return <div className="font-semibold">Pending</div>;
    } else if (statusNumber === 1){
      //setShow(true);
      return <div className="text-green-800 font-semibold">Accepted</div>;
    } else if (statusNumber === 2){
     return <div className="text-red-800 font-semibold">Rejected</div>;
    }
  }

  return (
    <>
    <div className='mb-96 mt-20'>
      <div className='flex justify-between'>
      <p className='mx-4 py-4 text-3xl cursor-pointer'>Intellectual Properties</p>  
       <button
            data-testid="wallet"
            onClick={connectWallet}
            className='bg-gradient-to-r from-black via-gray-500 to-black transition duration-150 ease-out hover:ease-in
            p-4 px-6 rounded-full text-white text-xl mr-2 mt-5 mb-10 hover:brightness-125 transition duration-150 ease-in-out shadow-lg'>
            Connect Wallet
        </button>
      </div>

     
      <div className='flex flex-wrap gap-14 mx-5 ml-12 mb-10 my-5'>
        <div className='box hover:brightness-105 transition duration-150 ease-out hover:ease-in border border-10 border-gray-300 rounded-lg bg-white w-56 p-2'>
         <h3 className="text-sm text-gray-600 flex justify-between"> Total Ips <FaHourglass className="text-black text-3xl"/></h3> 
         <br></br><span className='text-bold text-black text-4xl'>{pend + accept + reject}</span></div>
        <div className='box hover:brightness-105 transition duration-150 ease-out hover:ease-in border border-10 border-gray-300 rounded-lg bg-white w-56 p-2'>
        <h3 className="text-sm text-gray-600 flex justify-between"> Total Pendings <FaHourglass className="text-black text-3xl"/></h3>
         <br></br><span className='text-bold text-black text-4xl'>{pend}</span></div>
        <div className='box hover:brightness-105 transition duration-150 ease-out hover:ease-in border border-10 border-gray-300 rounded-lg bg-white w-56 p-2'>
        <h3 className="text-sm text-gray-600 flex justify-between"> Total Approves<FaHourglass className="text-black text-3xl"/></h3> 
         <br></br><span className='text-bold text-black text-4xl'>{accept}</span></div>
        <div className='box hover:brightness-105 transition duration-150 ease-out hover:ease-in border border-10 border-gray-300 rounded-lg bg-white w-56 p-2'>
        <h3 className="text-sm text-gray-600 flex justify-between text-sm"> Total Rejects <FaHourglass className="text-black text-3xl"/></h3>
         <br></br><span className='text-bold text-black text-4xl'>{reject}</span></div>
      </div>
    <div>
     
    <div>
    <NavLink to={{ pathname:`/ipregister`}}> 
       <button 
       data-testid='button-one'
       className='flex justify-end float-right mb-3 bg-black transition duration-150 ease-out hover:ease-in
       px-3 py-2 rounded text-white hover:brightness-105 transition duration-150 ease-in-out shadow-lg'>
       <FaPlus className='inline text-white mt-1 mr-1'/> Register IPs
       </button>
    </NavLink>
    </div>
    <table className='table table-striped mx-8 mt-24 shadow-lg'>
        <thead>
          <tr className=''>
            <th className='text-gray-900'>ID</th>
            <th className='text-gray-900'> Ip Name </th>
            <th className='text-gray-900'> Full Name</th>
            <th className='text-gray-900'> Country Name</th>
            <th className='text-gray-900'> Address</th>
            <th className='text-gray-900'> Status</th>
            <th className='text-gray-900'> Date</th>
            <th className='text-gray-900'></th>
          </tr>
        </thead>
        <tbody className='bg-gray-100'>

        {datas.map((item,index) => ( 
            <tr key={index}>
              <td >{index}</td>
              <td >{item.IPname}</td>    
              <td className='text-black'>{item.fullname}</td>  
              <td className='text-black'>{item.country}</td>  
              <td className='text-black'>{item.addressplace}</td>  
              <td className='text-black'>{status(item.status[item.status.length-1])}</td>   
              <td>{vals(item.timestamp['_hex'])}</td>
             {show ? ( <NavLink to={{ pathname:`/bidregister/${item.IPname}/${item.user}`}}  state={{item}}> 
                <button
                  className='ml-2 my-2 bg-black text-gray-100 transition duration-150 ease-out hover:ease-in
                  py-1 px-6 mt-5 rounded text-gray-900'>
                  Bid
                </button>
              </NavLink>):( null)}
              </tr>
         ))
         }         
        </tbody>
      </table> 
    </div>
    <div className='flex'>    
      {/* <div className='bg-cyan-900 opacity-75 text-white shadow-lg w-48 h-60 px-2'>
      <h2 className='text-2xl'>Search By</h2>
        <ul className='my-5'>
          <li><FaCheck className='inline'/> IP-name</li>
          <li><FaCheck className='inline'/> Location</li>
          <li><FaCheck className='inline'/> Year</li>
          <li></li>
        </ul>
      </div>
      */}
        {/* <Getips/> */}
    </div>
  </div>
  </>
  )
}

export default Ip