import React, { Component } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

class JokeList extends Component {
  static defaultProps = {
    numJokesToGet: 10,
  };

  constructor(props) {
    super(props);
    this.state = {
      jokes: [],
    };

    this.API_URL = "https://icanhazdadjoke.com/";
    this.getNewJokes = this.getNewJokes.bind(this);
    this.resetVotes = this.resetVotes.bind(this);
    this.toggleLock = this.toggleLock.bind(this);
    this.vote = this.vote.bind(this);
  }

  /* get jokes on mount */
  componentDidMount() {
    if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
  }

  /* get jokes if there are no jokes */
  componentDidUpdate() {
    if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
  }

  /* get jokes from API */

  async getJokes() {
    try {
      let jokes = this.state.jokes;
      let seenJokes = new Set(jokes.map((joke) => joke.id));
      let jokeVotes = JSON.parse(
        window.localStorage.getItem("jokeVotes") || "{}"
      );

      while (jokes.length < this.props.numJokesToGet) {
        let res = await axios.get(this.API_URL, {
          headers: { Accept: "application/json" },
        });
        let { status, ...joke } = res.data;

        if (!seenJokes.has(joke.id)) {
          seenJokes.add(joke.id);
          jokeVotes[joke.id] = jokeVotes[joke.id] || 0;
          jokes.push({ ...joke, votes: jokeVotes[joke.id], locked: false });
        } else {
          console.error("duplicate joke", joke);
        }
      }
      this.setState({ jokes });
      window.localStorage.setItem("jokeVotes", JSON.stringify(jokeVotes));
    } catch (e) {
      console.log(e);
    }
  }

  getNewJokes() {
    this.setState((state) => ({
      jokes: state.jokes.filter((joke) => !joke.locked),
    }));
  }

  vote(id, delta) {
    let jokeVotes = JSON.parse(window.localStorage.getItem("jokeVotes"));
    jokeVotes[id] = (jokeVotes[id] || 0) + delta;
    window.localStorage.setItem("jokeVotes", JSON.stringify(jokeVotes));
    this.setState((state) => ({
      jokes: state.jokes.map((joke) =>
        joke.id === id ? { ...joke, votes: joke.votes + delta } : joke
      ),
    }));
  }

  toggleLock(id) {
    this.setState((state) => ({
      jokes: state.jokes.map((joke) =>
        joke.id === id ? { ...joke, locked: !joke.locked } : joke
      ),
    }));
  }

  resetVotes() {
    window.localStorage.removeItem("jokeVotes");
    this.setState((state) => ({
      jokes: state.jokes.map((joke) => ({ ...joke, votes: 0 })),
    }));
  }

  render() {
    let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);
    let allLocked =
      sortedJokes.filter((joke) => joke.locked).length ===
      this.props.numJokesToGet;

    return (
      <div className="JokeList">
        <button
          className="JokeList-getmore"
          onClick={this.getNewJokes}
          disabled={allLocked}
        >
          Get New Jokes
        </button>
        <button className="JokeList-getmore" onClick={this.resetVotes}>
          Reset Votes
        </button>
        {sortedJokes.map((joke) => (
          <Joke
            key={joke.id}
            id={joke.id}
            text={joke.joke}
            votes={joke.votes}
            locked={joke.locked}
            toggleLock={this.toggleLock}
            vote={this.vote}
          />
        ))}
        {sortedJokes.length < this.props.numJokesToGet && (
          <div className="loading">
            <i className="fas fa-4x fa-spinner fa-spin" />
          </div>
        )}
      </div>
    );
  }
}

export default JokeList;
