import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

const user = {
  name: "Bob",
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 180
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
    <div>
      <h1>MyButton</h1>
      <button onClick={HandleClick}>Clicked {count} times thus far!</button>
    </div>
  );
}

function MyTwoButtons() {
  const[count, setCount] = useState(0);
  function HandleClick() {
    setCount(count + 1);
  }
  return(
    <div>
      <h1>MyTwoButtons</h1>
      <button onClick={HandleClick}>Button One Count: {count}</button>
      <button onClick={HandleClick}>Button Two Count: {count}</button>
    </div>
  )
}

function AboutPage() {
  return (
    <div>
      <h1>AboutPage</h1>
      <p>Hello there.<br />How do you do?</p>
    </div>
  );
}

function DisplayProfile() {
  return (
    <div>
      <h1>DisplayProfile</h1>
      <h2>{user.name}</h2>
      <img 
        className="avatar" 
        src={user.imageUrl}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </div>
  );
}

function ListItems() {
  return(
    <div>
      <h1>ListItems</h1>
      <ul>{listItems}</ul>
    </div>
  );
}

function GetStrings() {
  const [strings, setStrings] = useState([])
  const fetchStringData = () => {
    fetch("/users")
      .then(response => {
        return response.json()
      })
      .then(data => {
        setStrings(data)
      })
  }

  useEffect(() => {
    fetchStringData()
  }, [])

  return(
    <div>
      <h1>GetStrings</h1>
      {strings.length > 0 && (
        <ul>
          {strings.map(string => (
            <li key={string.id}>{string.name}: {string.email}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function GetSingleString() {
  const [string, setString] = useState('frontend response');
  const fetchSingleString = () => {
    fetch("/health-check")
      .then(response => {
        return response.json()
      })
      .then(data => {
        setString(data);
      })
  }

  useEffect(() => {
    fetchSingleString()
  })

  return(
    <div>
      <h1>GetSingleString</h1>
      <p>{string}</p>
    </div>
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
      <GetStrings />
      <GetSingleString />
      <AboutPage />
    </div>
  );
}
