import React, { Fragment } from 'react';

import Context from '../context/defaultContext';
import Search from '../components/Search';
import Spinner from '../components/Spinner'

import ReactGA from 'react-ga'

import history from '../utils/history';

export default class Start extends React.Component {
  static contextType = Context;

  componentDidMount() {
    ReactGA.pageview("Start");
  }

  render() {
    return (
      <Fragment>
        <Search addItem={this.context.addItem} />
        {this.context.error && this.context.error.code === 1 && (<div className="error"> Varan "{this.context.error.msg}" kunde hittas. Var god testa igen.</div>)}
        <div className="artical-list" style={{ "columnCount": this.context.data.length <= 10 ? "1" : this.context.data.length <= 20 ? "2" : "3" }}>
          {this.context.data.sort((a, b) => {
            if (a.query.toLowerCase() < b.query.toLowerCase()) return -1
            if (a.query.toLowerCase() > b.query.toLowerCase()) return 1
            return 0;
          }).map((item, i) => (
            <div className="artical" key={i}>
              {item.query} <button className="button--remove" onClick={e => (this.context.removeItem(item))}>x</button>
            </div>
          ))
          }
        </div>
        <div className="button-bar button-bar--center">
          <button className="button--primary" onClick={() => this.context.saveData(() => {
            history.push('/compare')
          })}>{this.context.isRating ? (<Spinner width="15px" image={"./spinner.png"} />) : "Jämför"}</button>
        </div>
      </Fragment>
    )
  }
}
