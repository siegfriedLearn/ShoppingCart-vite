import React from 'react'
//import ReactBootstrap from 'react-bootstrap';
import axios from 'axios'
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import {
    Card,
    //Accordion,
    //CustomToggle,
    Button,
    Container,
    Row,
    Col,
    Image,
  } from 'react-bootstrap';

// simulate getting products from DataBase
const products = [
    { name: "Apples:", country: "Italy", cost: 3, instock: 10 },
    { name: "Oranges:", country: "Spain", cost: 4, instock: 3 },
    { name: "Beans:", country: "USA", cost: 2, instock: 5 },
    { name: "Cabbage:", country: "USA", cost: 1, instock: 8 },
  ];
  //=========Cart=============
  const Cart = (props) => {
    //const { Card, Accordion, Button } = ReactBootstrap;
    let data = props.location.data ? props.location.data : products;
    console.log(`data:${JSON.stringify(data)}`);
  
    return <Accordion defaultActiveKey="0">{list}</Accordion>;
  };
  
  const useDataApi = (initialUrl, initialData) => {
    const { useState, useEffect, useReducer } = React;
    const [url, setUrl] = useState(initialUrl);
  
    const [state, dispatch] = useReducer(dataFetchReducer, {
      isLoading: false,
      isError: false,
      data: initialData,
    });
    console.log(`useDataApi called`);
    useEffect(() => {
      console.log("useEffect Called");
      let didCancel = false;
      const fetchData = async () => {
        dispatch({ type: "FETCH_INIT" });
        try {
          const result = await axios(url);
          console.log("FETCH FROM URl");
          if (!didCancel) {
            dispatch({ type: "FETCH_SUCCESS", payload: result.data });
          }
        } catch (error) {
          if (!didCancel) {
            dispatch({ type: "FETCH_FAILURE" });
          }
        }
      };
      fetchData();
      return () => {
        didCancel = true;
      };
    }, [url]);
    return [state, setUrl];
  };
  const dataFetchReducer = (state, action) => {
    switch (action.type) {
      case "FETCH_INIT":
        return {
          ...state,
          isLoading: true,
          isError: false,
        };
      case "FETCH_SUCCESS":
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload,
        };
      case "FETCH_FAILURE":
        return {
          ...state,
          isLoading: false,
          isError: true,
        };
      default:
        throw new Error();
    }
  };
  
  const Products = (props) => {
    const [items, setItems] = React.useState(products);
    const [cart, setCart] = React.useState([]);
    const [total, setTotal] = React.useState(0);
    
    //  Fetch Data
    const { Fragment, useState, useEffect, useReducer } = React;
    const [query, setQuery] = useState("http://localhost:1337/api/products");
    const [{ data, isLoading, isError }, doFetch] = useDataApi(
      "http://localhost:1337/api/products",
      {
        data: [],
      }
    );
    console.log(`Rendering Products ${JSON.stringify(data)}`);
    // Fetch Data
    const addToCart = (e) => {
      let name = e.target.name;
      let item = items.filter((item) => item.name == name);
      console.log(`add to Cart ${JSON.stringify(item)}`);
      let newProducts = [...items];
      newProducts.find((product,i)=>{
      if(product.name==name && product.instock>0){
        newProducts[i].instock=newProducts[i].instock-1
        setCart([...cart, ...item]);
      }
      }); 
      //doFetch(query);
    };
    const deleteCartItem = (index, item) => {
      let newCart = cart.filter((item, i) => index != i);
      let newProducts = [...items];
      newProducts.find((product,i)=>{
        if(product.name==item.name){
          newProducts[i].instock=newProducts[i].instock+1
          //setCart([...cart, ...item]);
        }
        }); 
      setCart(newCart);
    };
    
    //const photos = ["apple.png", "orange.png", "beans.png", "cabbage.png"];
  
    let list = items.map((item, index) => {
      let n = index + 1049;
      let url = "https://picsum.photos/id/" + n + "/50/50";
  
      return (
        <li key={index}>
          <Image src={url} width={70} roundedCircle></Image>
          <Button variant="primary" size="large">
            {item.name} ${item.cost} Stock: {item.instock}
          </Button>
          <input name={item.name} type="submit" onClick={addToCart}></input>
        </li>
      );
    });

    function CustomToggle({ children, eventKey }) {
      const decoratedOnClick = useAccordionButton(eventKey, () =>
        console.log('totally custom!'),
      );
    
      return (
        <Button
          type="button"
          variant="primary"
          onClick={decoratedOnClick}
        >
          {children}
        </Button>
      );
    }
    
    let cartList = cart.map((item, index) => {
      return (
        <Card key={index}>
          <Card.Header>
            {/* <Customtoogle as={Button} variant="link" eventKey={1 + index}>  Accordion.Toggle*/}
            <CustomToggle  eventKey={1 + index}>
              {item.name}
            </CustomToggle>
          </Card.Header>
          <Accordion.Collapse
            onClick={() => deleteCartItem(index, item)}
            eventKey={1 + index}
          >
            <Card.Body>
              $ {item.cost} from {item.country}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      );
    });
  
    let finalList = () => {
      let total = checkOut();
      let final = cart.map((item, index) => {
        return (
          <div key={index} index={index}>
            {item.name}
          </div>
        );
      });
      return { final, total };
    };
  
    const checkOut = () => {
      let costs = cart.map((item) => item.cost);
      const reducer = (accum, current) => accum + current;
      let newTotal = costs.reduce(reducer, 0);
      //console.log(`total updated to ${newTotal}`);
      return newTotal;
    };
    // TODO: implement the restockProducts function
    const restockProducts = (url) => {
  
      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
      fetch("http://localhost:1337/API/products", requestOptions)
        .then(response => response.json())
        .then(result => {
          //Extrayendo las propiedades originales del ejecicio de la api
          let arr = []
          result.data.map(product=> arr.push(product.attributes))
          setItems(arr)
        }
          )
        //setItems(result.data)
        .catch(error => console.log('error', error));
    };
  
    return (
      <Container>
        <Row>
          <Col>
            <h1>Product List</h1>
            <ul style={{ listStyleType: "none" }}>{list}</ul>
          </Col>
          <Col>
            <h1>Cart Contents</h1>
            <Accordion>{cartList}</Accordion>
          </Col>
          <Col>
            <h1>CheckOut </h1>
            <Button onClick={checkOut}>CheckOut $ {finalList().total}</Button>
            <div> {finalList().total > 0 && finalList().final} </div>
          </Col>
        </Row>
        <Row>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              restockProducts(`${query}`);
              console.log(`Restock called on ${query}`);
            }}
          >
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="submit">ReStock Products</button>
          </form>
        </Row>
      </Container>
    );
  };
 
  export default Products;