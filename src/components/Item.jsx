import React, { useState, Fragment } from 'react';

export default function Item(props) {
    const [isExpanded, setExpanded] = useState(false);

    const selectExpandedItem = (item) => {
        props.selectExpandedItem(item)
        setExpanded(!isExpanded)
    }

    const renderExpansion = () => {
        return (
            <Fragment>
                <div className="overflow" onClick={e => setExpanded(!isExpanded)}></div>
                <div className="float">
                    {props.expandingItem.map((item, i) => (
                        <div key={i} className={item.selected ? "item selected" : "item"}>
                            <button onClick={e => selectExpandedItem(item)} className="select">
                                <img src={item.image} alt={item.name} />
                                {item.selected && (<i className="material-icons">check_circle</i>)}
                            </button>
                            <button className="expand" onClick={e => selectExpandedItem(item)}>
                                <div>
                                    <h3>{item.name}</h3>
                                    <div>{item.price} kr</div>
                                </div>
                            </button>
                        </div>
                    ))}
                </div>
            </Fragment>
        )
    }

    return (
        <td>
            <div className={props.isSelected ? "item selected" : "item"}>
                <button onClick={props.selectItem} className="select">
                    <img src={props.image} alt={props.name} />
                    {props.isSelected && (<i className="material-icons">check_circle</i>)}
                </button>
                <button className="expand" onClick={e => setExpanded(!isExpanded)}>
                    <div>
                        <h3>{props.name}</h3>
                        <div>{props.price} kr</div>
                    </div>
                    <div>
                        <i className="material-icons">arrow_drop_down</i>
                    </div>
                </button>
            </div>
            {isExpanded && renderExpansion()}
        </td >
    );
}