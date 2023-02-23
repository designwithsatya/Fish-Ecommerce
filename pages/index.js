import PropTypes from 'prop-types';
import { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Link from 'next/link';
import { Container, Stack, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import Product from '../models/Product';
import db from '../utils/db';
import { Store } from '../utils/Store';
import { ProductSort, ProductFilterSidebar } from '../sections/@dashboard/products';

const BannerImgStyle = styled('img')(() => ({
  top: 0,
  width: '100%',
  height: '50vh',
  objectFit: 'cover',
  borderRadius: '5px',
}));

Home.propTypes = {
  products: PropTypes.array,
  featuredProducts: PropTypes.array,
};

export default function Home({ products, featuredProducts }) {
  const [openFilter, setOpenFilter] = useState(false);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      toast.error('Sorry. Product is out of stock');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    toast.success('Product added to the cart');
  };
  return (
    <>
      <Layout title="Home">
        <Carousel showThumbs={false} autoPlay>
          {featuredProducts.map((product) => (
            <Box key={product._id}>
              <Link href={`/product/${product.slug}`} passHref>
                <BannerImgStyle src={product.banner} alt={product.name} />
              </Link>
            </Box>
          ))}
        </Carousel>
        <Container>
          <Stack
            direction="row"
            flexWrap="wrap-reverse"
            alignItems="center"
            justifyContent="flex-end"
            sx={{ mb: 5, mt: 5 }}
          >
            <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
              <ProductFilterSidebar
                openFilter={openFilter}
                onOpenFilter={handleOpenFilter}
                onCloseFilter={handleCloseFilter}
              />
              <ProductSort />
            </Stack>
          </Stack>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Latest Product
          </Typography>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductItem product={product} key={product.slug} addToCartHandler={addToCartHandler} />
            ))}
          </div>
        </Container>
      </Layout>
    </>
  );
}
export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  const featuredProducts = await Product.find({ isFeatured: true }).lean();
  return {
    props: {
      featuredProducts: featuredProducts.map(db.convertDocToObj),
      products: products.map(db.convertDocToObj),
    },
  };
}
