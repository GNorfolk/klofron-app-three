import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

const user = {
  name: "bob",
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90
}

const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];

const listItems = products.map(product =>
  <li 
    key={product.id}
    style={{
      color: 'green'
    }}
  >
    {product.title}
  </li>
);

function MyButton() {
  const [count, setCount] = useState(0);
  function HandleClick() {
    setCount(count + 1);
  }
  return (
    <button onClick={HandleClick}>Clicked {count} times thus far!</button>
  );
}

function MyTwoButtons() {
  const[count, setCount] = useState(0);
  function HandleClick() {
    setCount(count + 1);
  }
  return(
    <div>
      <button onClick={HandleClick}>Button One Count: {count}</button>
      <button onClick={HandleClick}>Button Two Count: {count}</button>
    </div>
  )
}

function AboutPage() {
  return (
    <>
      <h1>About</h1>
      <p>Hello there.<br />How do you do?</p>
    </>
  );
}

function DisplayProfile() {
  return (
    <>
      <h1>
        {user.name}
      </h1>
      <img 
        className="avatar" 
        src={user.imageUrl}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}

function ListItems() {
  return(
    <ul>{listItems}</ul>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
      <DisplayProfile />
      <ListItems />
      <MyTwoButtons />
      <AboutPage />
    </div>
  );
}
