import React, { Component, Fragment } from 'react';
import { Col, Row } from 'reactstrap';

import Context from '../context/defaultContext';

class Header extends Component {
  static contextType = Context;

  render() {
    return (
      <Fragment>
        <Row className="header">
          <Col>
            <h1>Jämför varor</h1>
          </Col>
        </Row>
      </Fragment>
    )
  }
}


export default Header;