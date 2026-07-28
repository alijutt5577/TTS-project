export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
}

export const BEST_SELLERS: Product[] = [
  {
    id: '1',
    name: 'Embroidered Lawn 3-Piece',
    category: 'Unstitched',
    price: 'PKR 6,990',
    image: '/poster1.jpg',
  },
  {
    id: '2',
    name: 'Chiffon Dupatta Luxury Suit',
    category: 'Stitched 3pc',
    price: 'PKR 8,450',
    image: '/poster2.jpg',
  },
  {
    id: '3',
    name: 'Printed Kids Festive Suit',
    category: 'Kids Collection',
    price: 'PKR 4,200',
    image: '/poster3.jpg',
  },
  {
    id: '4',
    name: 'Cotton Silk Stitched Ensemble',
    category: 'New Arrivals',
    price: 'PKR 7,500',
    image: '/herobanner.jpg',
  },
];