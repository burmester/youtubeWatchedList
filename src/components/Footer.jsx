import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import Context from '../context/defaultContext';

class Header extends Component {
  static contextType = Context;

  render() {
    return (
        <Row className="footer">
          <Col>
          <p> 
            Din data sparas lokalt i webbläsare i from av <i>local Storage</i>.
          </p>
          <p>
            Cookies används för Google Analytics.
          </p>
          <p>
            Ditt beteende skickas till Google Analytics för att kunna använda vid analys av hur sidan användas.
            Inget kring ditt innehav eller uppgifter som dig skickas.
          </p>
          </Col>
        </Row>
    )
  }
}

export default Header;

