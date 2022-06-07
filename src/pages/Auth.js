import Login from "../components/Login"
import Register from "../components/Register"
import ImgDumbMerch from "../assets/DumbMerch.png";
import { Container, Row, Col } from "react-bootstrap";
import { UserContext } from "../context/userContext";
import { useContext, useState } from "react";
import { useNavigate } from 'react-router';

export default function Auth (){

    let navigate = useNavigate();
    const [state] = useContext(UserContext);

    const checkAuth = () => {
        if (state.isLogin === true) {
          navigate("/");
        }
    };
    checkAuth();
    
    const [isRegister, setIsRegister] = useState(false);

    const switchLogin = () => {
        setIsRegister(false);
    };

    const switchRegister = () => {
        setIsRegister(true);
    };

    return(
        <Container>
            <Row className="vh-100 d-flex align-items-center">
                <Col md="6">
                    <img src={ImgDumbMerch} className="img-fluid" style={{ width: "264px", height: "264px" }} alt="brand" />
                    <div className="text-auth-header mt-4">Easy, Fast and Reliable</div>
                    <p className="text-auth-parag mt-3">
                        Go shopping for merchandise, just go to dumb merch <br /> shopping. the biggest merchandise in{" "}
                        <b>Indonesia</b>
                    </p>
                    <div className="mt-5">
                        <button onClick={switchLogin} className="btn btn-login px-5">
                            Login
                        </button>
                        <button onClick={switchRegister} className="btn btn-register px-5">
                            Register
                        </button>
                    </div>
                </Col>
                <Col md="6">{isRegister ? <Register /> : <Login />}</Col>
            </Row>
        </Container>
    )
}