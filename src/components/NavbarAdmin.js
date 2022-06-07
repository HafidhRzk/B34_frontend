import React, { useContext } from 'react'
import { Container, Navbar as NavbarComp, Nav } from 'react-bootstrap'
import { Link, useNavigate } from "react-router-dom"
import ImgDumbMerch from '../assets/DumbMerch.png'
import { UserContext } from '../context/userContext'

export default function NavbarAdmin(props) {
    const [state, dispatch] = useContext(UserContext)

    let navigate = useNavigate()

    const logout = () => {
        console.log(state)
        dispatch({
            type: "LOGOUT"
        })
        navigate("/auth")
    }

    return (
        <NavbarComp expand="lg">
            <Container>
                <NavbarComp.Brand as={Link} to="/complain-admin">
                    <img src={ImgDumbMerch} className="img-fluid" alt="logo"
                        style={{ width: '60px', height: '60px' }} />
                </NavbarComp.Brand>
                <NavbarComp.Toggle aria-controls="basic-navbar-nav" />
                <NavbarComp.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/complain-admin" className="text-navbar">Complain</Nav.Link>
                        <Nav.Link as={Link} to="/category" className="text-navbar">Category</Nav.Link>
                        <Nav.Link as={Link} to="/product-admin" className="text-navbar">Product</Nav.Link>
                        <Nav.Link onClick={logout} className="text-navbar">Logout</Nav.Link>
                    </Nav>
                </NavbarComp.Collapse>
            </Container>
        </NavbarComp>
    )
}