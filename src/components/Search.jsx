import React, { useState } from 'react';
import Spinner from './Spinner'


export default function Search(props) {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAddItem = e => {
        if (loading) return false
        setLoading(true)
        props.addItem(query, () => {
            setQuery("")
            setLoading(false)
        })
    }

    return (
        <div className="search">
            <label>
                <input type="text" placeholder="Lägg till vara" onChange={e => setQuery(e.target.value)} value={query} onKeyPress={e => {
                    if (e.key === "Enter") handleAddItem()
                }} />
            </label>
            <button className="button--primary" onClick={handleAddItem}>{loading ? (<Spinner width="15px" image={"./spinner.png"} />) : "Lägg till"}</button>
        </div>
    );
}