import React from "react";
import { useState, useEffect } from "react";
import AsyncBoard from "react-trello";
import { useHistory } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

const Home = () => {
  const [userData, setUserData] = useState();
  const [show, setShow] = useState(false);
  const [cards, setCards] = useState([]);
  const [card, setcard] = useState();

  const handleClose = () => setShow(false);

  let Lane1 = cards.filter((card) => card.laneId === 1);
  let Lane2 = cards.filter((card) => card.laneId === 2);
  let Lane3 = cards.filter((card) => card.laneId === 3);
  console.log(Lane1);
  console.log(cards);
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

  useEffect(() => {
    getCards();

    console.log(cards);
  }, [card,show]);

  const AddCard = async (card, laneId) => {
    console.log(card);
    console.log(laneId);

    const res = await fetch("/addCard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ card, laneId }),
    });

    const data = await res.json();
    console.log(data);
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
    console.log(data);
  };

  const cardClick = (cardId, metadata, laneId) => {
    
    const card = cards.filter((c) => c.id === cardId);
    setcard(card[0]);
    console.log(card[0].title);
    setShow(true);
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
  console.log(data);

 }
 
 return (
    <div>
      
      <AsyncBoard
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
