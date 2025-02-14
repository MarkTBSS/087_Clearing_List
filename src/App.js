import { useState } from "react";

function App() {
    const [items, setItems] = useState([]);

    function handleAddItem(item) {
        setItems((items) => [...items, item]);
    }

    function handleDeleteItem(id) {
        setItems((items) => items.filter((item) => item.id !== id));
    }

    function handleToggleItem(id) {
        setItems((items) =>
            items.map((item) =>
                item.id === id ? { ...item, packed: !item.packed } : item
            )
        );
    }

    function handleClearList() {
        const confirmed = window.confirm(
            "Are you sure you want to delete all items?"
        );

        if (confirmed) setItems([]);
    }

    return (
        <div className="app">
            <Logo />
            <Form onAddItems={(item) => handleAddItem(item)} />
            <PackingList
                items={items}
                onDeleteItem={(id) => handleDeleteItem(id)}
                onToggleItem={(id) => handleToggleItem(id)}
                onClearList={() => handleClearList()}
            />
            <Stats items={items} />
        </div>
    );
}

function Logo() {
    return <h1>🌴 Far Away 🌴</h1>;
}

function Form({ onAddItems }) {
    const [description, setDescription] = useState("");
    const [quantity, setQuantity] = useState(1);

    function handleSubmit(event) {
        event.preventDefault();
        if (!description) {
            return;
        }

        const newItem = {
            description,
            quantity,
            packed: false,
            id: Date.now(),
        };
        console.log(newItem);

        onAddItems(newItem);
        setDescription("");
        setQuantity(1);
    }

    return (
        <form className="add-form" onSubmit={handleSubmit}>
            <h3>What do you need for your 😍 trip?</h3>
            <select
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value))}
            >
                {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                    <option value={num} key={num}>
                        {num}
                    </option>
                ))}
            </select>
            <input
                type="text"
                placeholder="item ..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
            />
            <button>Add</button>
        </form>
    );
}

function PackingList({ items, onDeleteItem, onToggleItem, onClearList }) {
    const [sortBy, setSortBy] = useState("input");
    let sortedItems = items;

    if (sortBy === "input") sortedItems = items;

    if (sortBy === "description")
        sortedItems = items
            .slice()
            .sort((a, b) => a.description.localeCompare(b.description));

    if (sortBy === "packed")
        sortedItems = items
            .slice()
            .sort((a, b) => Number(a.packed) - Number(b.packed));

    return (
        <div className="list">
            <ul>
                {sortedItems.map((item) => (
                    <Item
                        key={item.id}
                        item={item}
                        onDeleteItem={(id) => onDeleteItem(id)}
                        onToggleItem={(id) => onToggleItem(id)}
                    />
                ))}
            </ul>
            <div className="actions">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="input">Sort by input order</option>
                    <option value="description">Sort by description</option>
                    <option value="packed">Sort by packed status</option>
                </select>
                <button onClick={onClearList}>Clear list</button>
            </div>
        </div>
    );
}

function Item({ item, onDeleteItem, onToggleItem }) {
    return (
        <li>
            <input type="checkbox" value={item.packed} onChange={() => onToggleItem(item.id)} />
            <span style={item.packed ? { textDecoration: "line-through" } : {}}>
                {item.quantity} {item.description}
            </span>
            <button onClick={() => onDeleteItem(item.id)}>❌</button>
        </li>
    );
}

function Stats({ items }) {
    if (items.length === 0) {
        return <footer className="stats">🌴 Your list is empty. Add some items! 🌴</footer>;
    }
    const numItems = items.length;
    const numPacked = items.filter((item) => item.packed).length;
    const percentage = Math.round((numPacked / numItems) * 100);
    return (
        <footer className="stats">
            <em>
                {percentage === 100 ? "🎒 All packed and ready to go!" : `
                🎒 You have ${numItems} items in your list, and you already packed ${numPacked} (${percentage}%).`}
            </em>
        </footer>
    );
}

export default App;
