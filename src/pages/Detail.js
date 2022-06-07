import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import convertRupiah from 'rupiah-format';
import Navbar from '../components/Navbar';
import { useQuery, useMutation } from 'react-query';
import { useState } from 'react';
import { API } from '../config/api';

export default function DetailProduct() {
  let navigate = useNavigate();
  let { id } = useParams();

  const [state, setState] = useState({
    qty:'',
  });

  const { qty } = state

  let { data: product } = useQuery('productCache', async () => {
    const response = await API.get('/product/' + id);
    return response.data.data;
  });

  const handleOnChange = (e) => {
    console.log(`${e.target.name}: ${e.target.value}`);
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleCart = useMutation(async (e) => {
    try {
      e.preventDefault();

      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      const data = {
        idProduct: product.id,
        idSeller: product.user.id,
        name: product.name,
        price: product.price,
        qty,
      };

      const body = JSON.stringify(data);

      await API.post('/cart', body, config);

      navigate('/cart');
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div>
      <Navbar />
      <Container className="py-5">
        <Row>
          <Col md="2"></Col>
          <Col md="3">
            <img src={product?.image} className="img-fluid" alt={product?.name} />
          </Col>
          <Col md="5">
            <div className="text-header-product-detail">{product?.name}</div>
            <div className="text-content-product-detail">
              Stock : {product?.stock}
            </div>
            <p className="text-content-product-detail mt-4">{product?.desc}</p>
            <div className="text-price-product-detail text-end mt-4">
              {convertRupiah.convert(product?.price*state.qty)}
            </div>
            <div>
              <p>Qty:</p>
              <input
                    type="number"
                    min="0"
                    placeholder="Qty"
                    name="qty"
                    className="px-1 py-1 mt-1"
                    onChange={handleOnChange}
              />
            </div>
            <div className="d-grid gap-2 mt-5">
              <button className="btn btn-buy" onClick={(e) => handleCart.mutate(e)}>
                Add to Cart
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
