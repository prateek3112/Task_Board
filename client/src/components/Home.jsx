import React from "react";
import { useState, useEffect } from "react";
import Board from "react-trello";
import { useHistory } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

const Home = () => {
  const [userData, setUserData] = useState();
  const [show, setShow] = useState(false);
  const [cards, setCards] = useState([]);
  const [card, setcard] = useState();

  const handleClose = () => {
    getCards();
    setShow(false);
  }

  let Lane1 = cards.filter((card) => card.laneId === 1);
  let Lane2 = cards.filter((card) => card.laneId === 2);
  let Lane3 = cards.filter((card) => card.laneId === 3);
  
  const history = useHistory();
  const data = {
    lanes: [
      {
        id: "1",
        title: "TO DO",
        label: "0/0",
        cards: Lane1,
      },
      {
        id: "2",
        title: "In Progress",
        label: "0/0",
        cards: Lane2,
      },
      {
        id: "3",
        title: "Completed",
        label: "0/0",
        cards: Lane3,
      },
    ],
  };
 


  const checkValidity = async () => {
    try {
      const res = await fetch("/home", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.status === 200) {
        const error = new Error(res.error);
        throw error;
      }

      setUserData(data);
    } catch (ex) {
      console.log(ex);
      history.push("/login");
    }
  };
  const getCards = async () => {
    try {
      const res = await fetch("/getData", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.status === 200) {
        const error = new Error(res.error);
        throw error;
      }

      if (data) {
        setCards(data.cards);
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  useEffect(() => {
    checkValidity();
  }, []);

 

  const AddCard = async (card, laneId) => {
    

    const res = await fetch("/addCard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ card, laneId }),
    });

    const data = await res.json();
    console.log(data);

   getCards();
    
  };
  const onLaneChange = async (fromLaneId, toLaneId, cardId, index) => {
    console.log("from:", fromLaneId);
    console.log("to:", toLaneId);

    const res = await fetch("/updateCard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({cardId,toLaneId}),
    });

    const data = await res.json();
    getCards();
  };

  const cardClick = (cardId, metadata, laneId) => {
    debugger;
    getCards();
    if(cards){
      const card = cards.filter((c) => c.id === cardId);
    if(card[0]!==null){
      
      setcard(card[0]);
    console.log(card[0].title);
    setShow(true);
    
    }

    }
    getCards();
  };



 const cardDelete = async(cardId, laneId)=>{
  const res = await fetch("/deleteCard", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({cardId,laneId}),
  });

  const data = await res.json();
  
  getCards();

 }

 useEffect(() => {

  getCards();

  
}, []);
 
 return (
    <div>
      
      <Board
        data={data}
        onCardClick={(cardId, metadata, laneId) => {
          cardClick(cardId, metadata, laneId);
        }}
        onCardDelete={(cardId, laneId)=>{
          cardDelete(cardId, laneId);
        }}
        draggable
        editable
        onCardAdd={(card, laneId) => {
          AddCard(card, laneId);
        }}
        onCardMoveAcrossLanes={(fromLaneId, toLaneId, cardId, index) => {
          onLaneChange(fromLaneId, toLaneId, cardId, index);
        }}
      />
      {card && (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{card.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{card.description}</Modal.Body>
          <Modal.Footer>Created By : {card.createdBy}</Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Home;
