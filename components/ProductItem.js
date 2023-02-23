import PropTypes from 'prop-types';
import React from 'react';
import Link from 'next/link';
import { styled } from '@mui/material/styles';
import { Card, Box, Stack, Typography, Button } from '@mui/material';
import RatingScreen from './rating';

const StyledProductImg = styled('img')({
  top: 0,
  width: '100%',
  height: '80%',
  objectFit: 'cover',
  position: 'absolute',
});

const ProductItem = ({ product, addToCartHandler }) => (
  <>
    <Card sx={{ mb: 2 }}>
      <Box className="uniqueClass" sx={{ pt: '100%', position: 'relative' }}>
        <Link href={`/product/${product.slug}`}>
          <StyledProductImg src={product.image} alt={product.name} />
        </Link>
      </Box>
      <Stack spacing={2} sx={{ p: 3 }}>
        <RatingScreen rate={product.rating} count={product.numReviews} />
        <Typography variant="subtitle2" noWrap>
          {product.name}
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Button
            className="primary-button rounded py-2 px-4 shadow outline-none hover: bg-yellow-400 active:bg-yellow-500"
            onClick={() => addToCartHandler(product)}
          >
            Add to cart
          </Button>
          <Typography variant="subtitle1">₹ {product.price}</Typography>
        </Stack>
      </Stack>
    </Card>
  </>
);

export default ProductItem;
ProductItem.propTypes = {
  product: PropTypes.object,
  addToCartHandler: PropTypes.func,
};
