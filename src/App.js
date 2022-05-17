
import React,{ useEffect, useState } from 'react';
import lottery from './lottery';
import './App.css';
import web3 from './web3';

function App() {
  const [owner,setOwner] = useState("")
  const [players,setPlayers] = useState([])
  const [balance,setBalance] = useState("")
  const [value,setValue] = useState("")
  const [message,setMessage] = useState("")
  const [loader,setLoader] = useState("")

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

    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    await lottery.methods.enter().send(
      {
        from:accounts[0],
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
    </div>
  );
}

export default App;
