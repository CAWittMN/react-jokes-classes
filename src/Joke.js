import React, { Component } from "react";
import "./Joke.css";

class Joke extends Component {
  constructor(props) {
    super(props);
    this.handleUpVote = this.handleUpVote.bind(this);
    this.handleDownVote = this.handleDownVote.bind(this);
    this.handleToggleLock = this.handleToggleLock.bind(this);
  }

  handleUpVote() {
    this.props.vote(this.props.id, +1);
  }

  handleDownVote() {
    this.props.vote(this.props.id, -1);
  }

  handleToggleLock() {
    this.props.toggleLock(this.props.id);
  }

  render() {
    return (
      <div className={`Joke ${this.props.locked ? "Joke-locked" : ""}`}>
        <div className="Joke-votearea">
          <button onClick={this.handleUpVote}>
            <i className="fas fa-thumbs-up" />
          </button>
          <button onClick={this.handleDownVote}>
            <i className="fas fa-thumbs-down"></i>
          </button>
          <button onClick={this.handleToggleLock}>
            <i className={`fas fa-${this.props.locked ? "unlock" : "lock"}`} />
          </button>
          {this.props.votes}
        </div>
        <div className="Joke-text">{this.props.text}</div>
      </div>
    );
  }
}

export default Joke;
