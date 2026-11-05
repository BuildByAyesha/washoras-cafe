export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  tag?: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Iced Matcha Latte",
    category: "Matcha",
    price: 450,
    image:
      "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=800&q=85",
    description: "Creamy matcha, chilled milk and a little magic.",
    tag: "BESTSELLER",
  },
  {
    id: 2,
    name: "Caramel Iced Coffee",
    category: "Coffee",
    price: 380,
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=85",
    description: "Bold espresso with silky caramel.",
    tag: "FAN FAVOURITE",
  },
  {
    id: 3,
    name: "Chocolate Brownie",
    category: "Dessert",
    price: 320,
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=85",
    description: "Rich, fudgy chocolate in every bite.",
    tag: "MUST TRY",
  },
  {
    id: 4,
    name: "Classic Cappuccino",
    category: "Coffee",
    price: 350,
    image:
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=85",
    description: "Fresh espresso topped with silky foam.",
  },
  {
    id: 5,
    name: "Strawberry Matcha",
    category: "Matcha",
    price: 490,
    image:
      "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=85",
    description: "Earthy matcha meets sweet strawberry.",
    tag: "NEW",
  },
  {
    id: 6,
    name: "Smash Beef Burger",
    category: "Burgers",
    price: 650,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=85",
    description: "Juicy beef, melted cheese and house sauce.",
  },
  {
    id: 7,
    name: "Classic Pepperoni Pizza",
    category: "Pizza",
    price: 850,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=85",
    description: "Golden crust, rich sauce and cheesy goodness.",
  },
  {
    id: 8,
    name: "Loaded French Fries",
    category: "Sides",
    price: 280,
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=85",
    description: "Crispy fries with our signature seasoning.",
  },
];

export const burgerLayers = [
  {
    name: "Sesame bun",
    note: "Toasted in butter, soft inside",
    side: "right",
  
    image: "https://images.unsplash.com/photo-1632552544552-3ca612a328ac?auto=format&fit=crop&w=800&q=85"
     
  },
  {
    name: "Fresh lettuce",
    note: "Crisp and washed every morning",
    side: "left",

    image: "https://images.unsplash.com/photo-1450893979860-22a2c0a0518f?auto=format&fit=crop&w=800&q=85",

  },
  {
    name: "Tomato slices",
    note: "Juicy, hand-sliced",
    side: "right",
    image:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=500&q=85",
  },
  {
    name: "Melted cheese",
    note: "Gooey cheddar on the hot patty",
    side: "left",
    
image: "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&w=800&q=85",

  },
  {
    name: "Smash beef patty",
    note: "100% beef, seared with a crispy edge",
    side: "right",
    image:
      "https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=500&q=85",
  },
  {
    name: "Bottom bun",
    note: "Holds the house sauce",
    side: "left",
 
    image: "https://images.unsplash.com/photo-1632552544552-3ca612a328ac?auto=format&fit=crop&w=800&q=85",

  
  },
];