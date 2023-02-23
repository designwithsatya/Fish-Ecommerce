import PropTypes from 'prop-types';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Container } from '@mui/material';
import { Store } from '../../utils/Store';
import Layout from '../../components/Layout';
import db from '../../utils/db';
import Product from '../../models/Product';
import RatingScreen from '../../components/rating';

const ProductScreen = (props) => {
  const { product } = props;
  const { state, dispatch } = useContext(Store);
  const [adding, setAdding] = useState(false);
  const router = useRouter();
  if (!product) {
    return <Layout title="Produt Not Found">Produt Not Found</Layout>;
  }

  const addToCartHandler = async () => {
    setAdding(true);
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      toast.error('Sorry Product Out of Stock');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    setAdding(false);
    router.push('/cart');
    toast.success('Product is Added');
  };

  return (
    <div>
      <Layout title={product.name}>
        <Container>
          <div className="py-2">
            <Link className="text-purple-800" href="/">
              Back To Products
            </Link>
          </div>
          <div className="grid md:grid-cols-4 md:gap-3">
            <div className="md:col-span-2 max-w-screen-lg">
              <div className="relative w-72 h-72 sm:w-96 sm:h-96">
                <Image className="rounded" src={product.image} alt={product.name} layout="fill" objectFit="contain" />
              </div>
            </div>
            <div>
              <ul>
                <li>
                  <h1 className="text-lg">Fish Name - {product.name}</h1>
                </li>
                <li>Category: {product.category}</li>
                <li>Variety: {product.variety}</li>
                <li>
                  <RatingScreen rate={product.rating} count={product.numReviews} />
                </li>
                <li>Description: {product.description}</li>
              </ul>
            </div>
            <div>
              <div className="card p-5 card mb-5 block rounded-lg border border-gray-300 shadow-md">
                <div className="mb-2 flex justify-between">
                  <div>Price</div>
                  <div>₹{product.price}</div>
                </div>
                <div className="mb-2 flex justify-between">
                  <div>Status</div>
                  <div>{product.countInStock > 0 ? 'In stock' : 'Unavailable'}</div>
                </div>
                <button
                  type="button"
                  onClick={addToCartHandler}
                  disabled={adding || props.disabled}
                  className={` bg-yellow-400 text-white rounded-lg py-1 px-4 hover:bg-rose-300 hover:border-yellow-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    adding
                      ? 'disabled:bg-yellow-500 disabled:border-yellow-300 disabled:text-white'
                      : 'disabled:hover:bg-transparent disabled:hover:text-current disabled:hover:border-gray-300'
                  }`}
                >
                  {adding ? 'Adding...' : 'Add to cart'}
                </button>
              </div>
            </div>
          </div>
        </Container>
      </Layout>
    </div>
  );
};

export default ProductScreen;

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}
ProductScreen.propTypes = {
  product: PropTypes.object,
  disabled: PropTypes.bool,
};
