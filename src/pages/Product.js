import Navbar from "../components/Navbar"
import Masonry from 'react-masonry-css';
import { Container, Row, Col } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import { useQuery } from 'react-query';
import { API } from '../config/api';

export default function Product (){
  const breakpointColumnsObj = {
    default: 6,
    1100: 4,
    700: 3,
    500: 2,
  };

  let { data: products } = useQuery('productsCache', async () => {
    const response = await API.get('/products');
    return response.data.data;
  });

  return(
    <div>
      <Navbar />
      <Container className="mt-5">
        <Row>
          <Col>
            <div className="text-header-product">Product</div>
          </Col>
        </Row>
        <Row className="my-4">
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {products?.map((item, index) => (
              <ProductCard item={item} key={index} />
            ))}
          </Masonry>
        </Row>
      </Container>
    </div>
  )
}