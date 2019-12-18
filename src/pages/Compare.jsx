import React, { Fragment } from 'react';
import { Col, Row, Table } from 'reactstrap';
import Item from '../components/Item';

import Context from '../context/defaultContext';

import ReactGA from 'react-ga'

import history from '../utils/history';


export default class Compare extends React.Component {
  static contextType = Context;

  componentDidMount() {
    ReactGA.pageview("Compare");
  }

  selectItem = (selected, item) => {
    this.context.selectItem(selected, item);
  }

  renderTotal = data => {
    let total = { matHem: 0, ica: 0, mat: 0 }
    data.forEach((item) => {
      total = {
        matHem: total.matHem + item.items.matHem.price,
        ica: total.ica + item.items.ica.price,
        mat: total.mat + item.items.mat.price
      }
    })
    return (
      <Fragment>
        <td><b>Totalt</b></td>
        <td>{total.matHem.toFixed(2)}</td>
        <td>{total.ica.toFixed(2)}</td>
        <td>{total.mat.toFixed(2)}</td>
      </Fragment>
    )
  }

  render() {
    return (
      <Fragment>
        <Row>
          <Col className="button-bar">
            <button className="button--primary" onClick={() => {
              history.push('/')
            }}>Lägg till fler</button>
            <button className="button--destuctive" onClick={() => this.context.removeData(() => {
              history.push('/')
            })}>Töm</button>
          </Col>
        </Row>
        <Table>
          <thead>
            <tr className="sticky">
              <th>Sökord</th>
              <th>MatHem</th>
              <th>Ica</th>
              <th>Mat.se</th>
            </tr>
          </thead>
          <tbody>
            {this.context.data.map((item, i) => (
              <tr key={i}>
                <td>
                  <h3 className="middle">{item.query}</h3>
                </td>
                <Item
                  name={item.items.matHem.name}
                  price={item.items.matHem.price.toFixed(2)}
                  selectItem={e => this.selectItem(item.items.matHem, item)}
                  isSelected={item.items.matHem.selected}
                  expandingItem={item.result.find(store => store.store === "matHem").items}
                  selectExpandedItem={selectedItem => this.selectItem(selectedItem, item)}
                  image={item.items.matHem.image} />
                  <Item
                  name={item.items.ica.name}
                  price={item.items.ica.price.toFixed(2)}
                  selectItem={e => this.selectItem(item.items.ica, item)}
                  isSelected={item.items.ica.selected}
                  expandingItem={item.result.find(store => store.store === "ica").items}
                  selectExpandedItem={selectedItem => this.selectItem(selectedItem, item)}
                  image={item.items.ica.image} />
                  <Item
                  name={item.items.mat.name}
                  price={item.items.mat.price.toFixed(2)}
                  selectItem={e => this.selectItem(item.items.mat, item)}
                  isSelected={item.items.mat.selected}
                  expandingItem={item.result.find(store => store.store === "mat").items}
                  selectExpandedItem={selectedItem => this.selectItem(selectedItem, item)}
                  image={item.items.mat.image} />
              </tr>
            ))
            }
            <tr className="sticky">
              {this.renderTotal(this.context.data)}
            </tr>
          </tbody>
        </Table>
      </Fragment>
    );
  }
}
