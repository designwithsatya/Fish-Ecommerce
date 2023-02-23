import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'satyendra',
      email: 'satyendrasingh@gmail.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
      gender: 'Male',
      contactNumber: '7869351835',
      address: 'Banda Uttar Pradesh',
    },
    {
      name: 'satya',
      email: 'user@gmail.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    },
  ],
  products: [
    {
      name: 'Online Shopping',
      slug: 'fish1',
      category: 'fish',
      image: '/images/rohu2.webp',
      price: 70,
      variety: 'fish',
      rating: 4.5,
      numReviews: 8,
      countInStock: 20,
      description: 'A popular shirt',
      isFeatured: true,
      banner:
        'https://images.pexels.com/photos/1304154/pexels-photo-1304154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      name: 'Rohu',
      slug: 'fish2',
      category: 'fish',
      image: '/images/katla2.jpg',
      price: 80,
      variety: 'fish',
      rating: 3.2,
      numReviews: 10,
      countInStock: 20,
      description: 'A popular shirt',
      isFeatured: true,
      banner:
        'https://images.pexels.com/photos/8444324/pexels-photo-8444324.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },

    {
      name: 'Katla',
      slug: 'fish3',
      category: 'Fish',
      image: '/images/katla.webp',
      price: 120,
      variety: 'Fish',
      rating: 4.5,
      numReviews: 3,
      countInStock: 2,
      description: 'A popular Fish In UP',
    },
    {
      name: 'Katla',
      slug: 'fish4',
      category: 'Fish',
      image: '/images/katla2.jpg',
      price: 130,
      variety: 'Fish',
      rating: 4.5,
      numReviews: 2,
      countInStock: 5,
      description: 'A popular Fish In UP',
    },
    {
      name: 'Magur',
      slug: 'fish5',
      category: 'Magur Fish',
      image: '/images/magur.jpeg',
      price: 220,
      variety: 'Fish',
      rating: 4.1,
      numReviews: 3,
      countInStock: 2,
      description: 'A popular Fish In UP',
    },
    {
      name: 'Nain',
      slug: 'fish6',
      category: 'Nain Fish',
      image: '/images/nain.jfif',
      price: 120,
      variety: 'NainFish',
      rating: 2.4,
      numReviews: 3,
      countInStock: 10,
      description: 'A popular Fish In UP',
    },
    {
      name: 'Nain',
      slug: 'fish7',
      category: 'Nain Fish',
      image: '/images/nain1.png',
      price: 120,
      variety: 'NainFish',
      rating: 4.5,
      numReviews: 3,
      countInStock: 2,
      description: 'A popular Fish In UP',
    },
    {
      name: 'Rohu',
      slug: 'fish8',
      category: 'Rohu Fish',
      image: '/images/rohu.webp',
      price: 250,
      variety: 'RohuFish',
      rating: 4.8,
      numReviews: 3,
      countInStock: 2,
      description: 'A popular Fish In UP',
    },
    {
      name: 'Rohu',
      slug: 'fish9',
      category: 'Rohu Fish',
      image: '/images/rohu2.webp',
      price: 120,
      variety: 'RohuFish',
      rating: 4.5,
      numReviews: 3,
      countInStock: 2,
      description: 'A popular Fish In UP',
    },
    {
      name: 'Singhra',
      slug: 'fish10',
      category: 'Singhra Fish',
      image: '/images/singhra.webp',
      price: 120,
      variety: 'SinghraFish',
      rating: 4.5,
      numReviews: 3,
      countInStock: 2,
      description: 'A popular Fish In UP',
    },
  ],
};

export default data;