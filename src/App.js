import React, { Component } from "react";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";

class App extends Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    lastWinner: ""
  };

  async componentDidMount() {
    const [manager, players, lastWinner, balance] = await Promise.all([
      await lottery.methods.manager().call(),
      await lottery.methods.getPlayers().call(),
      await lottery.methods.lastWinner().call(),
      await web3.eth.getBalance(lottery.options.address)
    ]);

    this.setState({ manager, players, lastWinner, balance });
  }

  onSubmit = async event => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Wating on transcation success..." });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether")
    });

    this.setState({ message: "You have been entered!" });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transcation success" });

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: `A winner has been picked! ${this.state.lastWinner}` });
  };

  render() {
    return (
      <div>
        <h2>Lottery</h2>
        <p>
          This contract is managed by {this.state.manager}. There are currently{" "}
          {this.state.players.length} people entered, competing to win{" "}
          {web3.utils.fromWei(this.state.balance, "ether")} ether!
        </p>
        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
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
