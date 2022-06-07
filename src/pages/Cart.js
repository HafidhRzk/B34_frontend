import { Container, Row, Col, Button } from 'react-bootstrap'
import Navbar from '../components/Navbar'
import convertRupiah from 'rupiah-format';
import dateFormat from 'dateformat';
import { useQuery, useMutation } from 'react-query';
import { useState, useEffect } from 'react';
import { API } from '../config/api';
import { useParams, useNavigate } from 'react-router-dom';
import DeleteData from '../components/DeleteData';
import ImgDumb from '../assets/DumbMerch.png'

export default function Cart (){

    let navigate = useNavigate();
    let { id } = useParams();

    const [idDelete, setIdDelete] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    let { data: carts, refetch } = useQuery('cartsCache', async () => {
        const response = await API.get('/carts');
        return response.data.data;
    });

    useEffect(() => {
        //change this to the script source you want to load, for example this is snap.js sandbox env
        const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
        //change this according to your client-key
        const myMidtransClientKey = 'SB-Mid-client-nB8GaJ0jUBqQjXDa';
    
        let scriptTag = document.createElement('script');
        scriptTag.src = midtransScriptUrl;
        // optional if you want to set script attribute
        // for example snap.js have data-client-key attribute
        scriptTag.setAttribute('data-client-key', myMidtransClientKey);
    
        document.body.appendChild(scriptTag);
        return () => {
          document.body.removeChild(scriptTag);
        };
    }, []);

    const handlePay = useMutation(async (e) => {
        try {
            e.preventDefault();

            const priceCart = carts?.map((item) => {return item.product.price*item.qty;})
            .reduce((a, b) => a + b, 0)

            const nameCart = carts?.map((item) => {return item.product.name;})
            .join(", ")

            const qtyCart = carts?.map((item) => {return item.qty;})
            .reduce((a, b) => a + b, 0)
      
            const config = {
              headers: {
                'Content-type': 'application/json',
              },
            };
      
            const data = {
                list: nameCart,
                qty: qtyCart,
                total: priceCart
            };
      
            const body = JSON.stringify(data);
      
            const response = await API.post('/transaction', body, config);
            carts?.map((item) => {return API.delete(`/cart/${item.id}`)})
            console.log(response);
            const token = response.data.payment.token;
            window.snap.pay(token, {
                onSuccess: function (result) {
                  /* You may add your own implementation here */
                  alert("payment success!"); console.log(result);
                },
                onPending: function (result) {
                  /* You may add your own implementation here */
                  alert("waiting your payment"); console.log(result);
                },
                onError: function (result) {
                  /* You may add your own implementation here */
                  alert("payment failed!"); console.log(result);
                },
                onClose: function () {
                  /* You may add your own implementation here */
                  alert('you closed the popup without finishing the payment');
                },
            });
        } catch (error) {
            console.log(error);
        }
    });

    const handleDelete = (id) => {
        setIdDelete(id);
        handleShow();
    };

    const deleteById = useMutation(async (id) => {
        try {
            await API.delete(`/cart/${id}`);
            refetch();
        } catch (error) {
            console.log(error);
        }
    });

    useEffect(() => {
        if (confirmDelete) {
            handleClose();
            deleteById.mutate(idDelete);
            setConfirmDelete(null);
        }
    }, [confirmDelete]);

    return(
        <div>
            <Navbar />
            <Container className='py-5'>
                <div className="text-header-product mb-4">My Cart</div>
                <Row>
                    <Col md="6">
                        <div>
                            {carts?.map((item, index) => (
                            <div key={index} style={{ background: '#303030' }} className="p-2 mb-1">
                                <Container fluid className="px-1">
                                    <Row>
                                        <Col xs="3">
                                            <img
                                                src={item.product.image}
                                                alt={ImgDumb}
                                                className="img-fluid"
                                                style={{
                                                    height: '120px',
                                                    width: '170px',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        </Col>
                                        <Col xs="6">
                                            <div
                                                style={{
                                                    fontSize: '18px',
                                                    color: '#F74D4D',
                                                    fontWeight: '500',
                                                    lineHeight: '19px',
                                                }}
                                            >
                                                {item.product.name}
                                            </div>
                                            <div
                                                className="mt-2"
                                                style={{
                                                    fontSize: '14px',
                                                    color: '#F74D4D',
                                                    fontWeight: '300',
                                                    lineHeight: '19px',
                                                }}
                                            >
                                                {dateFormat(item.createdAt, 'dddd, d mmmm yyyy')}
                                            </div>
                                            <div
                                                className="mt-3"
                                                style={{
                                                    fontSize: '14px',
                                                    fontWeight: '300',
                                                }}
                                            >
                                                Price : @{convertRupiah.convert(item.product.price)}
                                            </div>
                                            <div
                                                className="mt-3"
                                                style={{
                                                    fontSize: '14px',
                                                    fontWeight: '300',
                                                }}
                                            >
                                                Qty : {item.qty}
                                            </div>
                                        </Col>
                                            <Button
                                                onClick={() => {handleDelete(item.id);}}
                                                className="btn-sm btn-danger"
                                                style={{ width: '100px', margin: '5px', height: '30px' }}
                                            >
                                                Remove Cart
                                            </Button>
                                        <Col>
                                        </Col>
                                    </Row>
                                </Container>
                            </div>
                            ))}
                        </div>
                    </Col>
                    <Col md="6" style={{ borderTop: "1px solid" }}>
                        {carts?.map((item, index) => (
                        <Row key={index} className="p-2 mb-1">
                            <Col>
                                {item.product.name}
                            </Col>
                            <Col>
                                {convertRupiah.convert(item.product.price*item.qty)}
                            </Col>
                        </Row>
                        ))}
                        <Row className="p-2 mb-1" style={{ borderTop: "1px solid" }}>
                            <Col>
                                Total:
                            </Col>
                            <Col>
                                {convertRupiah.convert(
                                    carts?.map((item) => {
                                        return item.product.price*item.qty;
                                    })
                                    .reduce((a, b) => a + b, 0)
                                )}
                            </Col>
                        </Row>
                        <div className="d-grid gap-2 mt-5">
                            <Button type="submit" variant="danger" size="md" 
                            onClick={(e) => handlePay.mutate(e)}>
                                Pay
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
            <DeleteData
                setConfirmDelete={setConfirmDelete}
                show={show}
                handleClose={handleClose} 
            />
        </div>
    )
}