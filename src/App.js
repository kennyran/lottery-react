import "./App.css";
import React from "react";
import web3 from './web3';
import lottery from "./lottery";

class App extends React.Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  };

  async componentDidMount() {
    // .call() doesn't need a {from: accounts[0]} because the provider has a default account assigned to it with us being connected to MetaMask
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  onSubmit = async event => {
    event.preventDefault(); // prevents html from automatically running the event without being clicked

    // assume that the first account in the array will be the one sending the transaction
    const accounts = await web3.eth.getAccounts();

    // Message to let user know transaction is being processed
    this.setState({ message: 'Waiting on transaction success...' })

    // send function
    // will take 15-30 seconds to complete
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    // message that lets them know transaction has processed 
    this.setState({ message: 'You have successfully been entered!' });
  }

  onClick = async () => {
    // get list of accounts
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...'})

    //send function pick a winner
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    })

    this.setState({ message: 'A winner has been picked!'});
  }

  render() {
    web3.eth.getAccounts()
      .then(console.log);
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>This contract is managed by {this.state.manager}.
        There are currently {this.state.players.length} people entered to win {web3.utils.fromWei(this.state.balance, 'ether')} ether.
        </p>
        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Give it a shot</h4>
          <div>
            <label>Amount of ether to enter </label>
            <input 
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value})}
            />
          </div>
          <button>Enter</button>
        </form>

        <hr />

        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner!</button>

        <hr />
        <h1>{this.state.message}</h1>
    
      </div>
    );
  }
}
export default App;
