import Navbar from "../components/Navbar"
import React, { useEffect, useState, useContext } from "react"
import { io } from "socket.io-client"
import Contact from "../components/Contact"
import { Col, Container, Row } from "react-bootstrap"
import Chat from "../components/Chat"
import { UserContext } from "../context/userContext"

let socket

export default function Complain (){
    const [contact, setContact] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [messages, setMessages] = useState([]);

    const [state] = useContext(UserContext);

    useEffect(() =>{
        socket = io( process.env.REACT_APP_SERVER_URL || 'http://localhost:5000', {
            auth: {
                token: localStorage.getItem('token'),
            },
        });

        socket.on('new message', () => {
            socket.emit('load messages', contact?.id);
        });

        socket.on('connect_error', (err) => {
            console.error(err.message);
        });

        loadContact();
        loadMessages();
 
        return () => {
            socket.disconnect()
        }
    }, [messages])

    const loadContact = () => {
        socket.emit('load admin contact')
        socket.on('admin contact', (data) => {
            data.message =
                messages.length > 0
                    ? messages[messages.length - 1].message
                    : 'Click here to start message';
            setContacts([data])
        })
    };

    const loadMessages = () => {
        socket.on('messages', (data) => {
          console.log(data);
          if (data.length > 0) {
            const dataMessages = data.map((item) => ({
              idSender: item.sender.id,
              message: item.message,
            }));
            setMessages(dataMessages);
          } else {
            setMessages([]);
          }
        });
    };

    const onSendMessage = (e) => {
        if (e.key === 'Enter') {
          const data = {
            idRecipient: contact.id,
            message: e.target.value,
          };
    
          socket.emit('send message', data);
          e.target.value = '';
        }
    };

    const onClickContact = (data) => {
        setContact(data);
        socket.emit('load messages', data.id);
    };

    return(
        <div>
            <Navbar />
            <Container fluid style={{ height: "89" }}>
                <Row>
                    <Col md={3} style={{ height: "89", borderRight: "1px solid white" }}>
                        <Contact 
                            clickContact={onClickContact}
                            dataContact={contacts}
                            contact={contact}
                        />
                    </Col>
                    <Col md={9} style={{ height: "89", borderRight: "1px solid white" }}>
                        <Chat
                            contact={contact}
                            messages={messages}
                            user={state.user}
                            sendMessage={onSendMessage}
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    )
}