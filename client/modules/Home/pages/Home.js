import React, { Component } from 'react';
import QuizList from 'modules/Home/containers/QuizList';

class Home extends Component {
  render() {
    return (
      <div className="container">
        <QuizList />
      </div>
    );
  }
}

export default Home;
