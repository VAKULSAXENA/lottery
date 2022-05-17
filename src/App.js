
import React,{ useEffect, useState } from 'react';
import lottery from './lottery';
import './App.css';
import Web3 from "web3";
import {TailSpin} from 'react-loader-spinner';

function App() {
  const [owner,setOwner] = useState("")
  const [players,setPlayers] = useState([])
  const [balance,setBalance] = useState("")
  const [value,setValue] = useState("")
  const [message,setMessage] = useState("")
  const [loader,setLoader] = useState("")
  const[web3,setWeb3] = useState()
  const[address,setAddress] = useState()

  const getOwner=async()=>{
    const owner = await lottery.methods.owner().call();
    setOwner(owner);
  }

  // const getPlayers=async()=>{
  //   const players = await lottery.methods.players().call();
  //   setPlayers(players);
  // }

  const getBalance=async()=>{
    const balance = await web3.eth.getBalance(lottery.options.address);
  }

  useEffect(() => {
    getOwner();
    // getPlayers();
    getBalance();
    return () => {
      
    }
  }, [balance])
  
  const onSubmit = async(e)=>{
    e.preventDefault();
    if(typeof window !== 'undefined' && typeof window.ethereum !=='undefined'){
      try {
        await window.ethereum.request({method:"eth_requestAccounts"})
        const web3 = new Web3(window.ethereum);
        setWeb3(web3);
        const accounts = await web3.eth.getAccounts();
        setAddress(accounts[0]);
        console.log(accounts);
      } catch (error) {
        console.log(error.message);
      }
    }else{
      console.log("Please install metamask");
    }
   
  
    await lottery.methods.enter().send(
      {
        from:address[0],
        value:web3.utils.toWei(value,'ether'),
      }
    )
    setLoader(!loader);
    setMessage("you have been entered!");
  }

  const onClick=async()=>{
    const accounts = await web3.eth.getAccounts();
    setLoader(!loader);
    await lottery.methods.pickWinner().send({
      from:accounts[0],
    });
    setLoader(false);

  }

  const onEnter = ()=>{
    setLoader(!loader);
  }


  return (
    <div>
      <h2>Lottery Contract</h2>
      <p> This Contract is managed by {owner}
      <br/> There are currently {players.length} people enter to win {web3.utils.fromWei(balance,'ether')} ether!
      </p>
      <hr/>
      <form onSubmit={onSubmit}>
        <h4>Want to try your Luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input  onChange={(e)=>{setValue(e.target.value)}}/>
        </div>
        <button onClick={onEnter}>Enter</button>
      </form>
      <hr/>
      <h4>Ready to pick a winner</h4>
      <button onClick={onClick}>Pick a winner</button>
      <hr/>
      {loader ? <TailSpin color='#00BFFF' height={80} width={80}/>:(
        <h1>{message}</h1>
      )}
    </div>
  );
}

export default App;
