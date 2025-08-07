type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  sizes: {
    [size: string]: number | undefined; // Tillåt att vissa storlekar är undefined
  };
};
