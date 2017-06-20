import React, { Component } from 'react';
import { Row } from 'react-bootstrap';
import QuizListItem from 'modules/Home/components/QuizListItem';

export class Home extends Component {
  render() {
    return (
      <Row>
        <QuizListItem
          _id="12345"
          title="What Does Your Name Mean In Ancient Times?"
          imageUrl="//image.nametests.com/cache/images/promote_image/2017/06/19/d315cfe6c52bf30758493e43f09cda07/236eac7069a54c1a93ab7bae8ae2201f.jpg"
        />
      </Row>
    );
  }
}

export default Home;
