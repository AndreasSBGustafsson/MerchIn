"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  sizes: { [size: string]: number };
};

type Props = {
  product: Product;
  onAddToCart?: (item: {
    productId: string;
    size: string;
    quantity: number;
  }) => void;
};

export default function ProductCard({ product, onAddToCart }: Props) {
  // Hitta första storlek med lager > 0
  const firstAvailableSize =
    Object.entries(product.sizes).find(([_, qty]) => qty > 0)?.[0] || "";

  const [selectedSize, setSelectedSize] = useState<string>(firstAvailableSize);
  const [quantities, setQuantities] = useState<{ [size: string]: number }>({
    [firstAvailableSize]: 1,
  });

  useEffect(() => {
    // Om produkten byts ut kan vi sätta om val
    setSelectedSize(firstAvailableSize);
    setQuantities({ [firstAvailableSize]: 1 });
  }, [product]);

  const currentQuantity = selectedSize ? quantities[selectedSize] || 0 : 0;
  const maxAvailable = selectedSize ? product.sizes[selectedSize] : 0;

  const handleSelectSize = (size: string) => {
    setSelectedSize(size);
    if (!quantities[size]) {
      setQuantities((prev) => ({ ...prev, [size]: 1 }));
    }
  };

  const handleChangeQuantity = (delta: number) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity < 1 || newQuantity > maxAvailable) return;
    setQuantities((prev) => ({ ...prev, [selectedSize]: newQuantity }));
  };

  const handleAddToCart = () => {
    if (!selectedSize) return;
    const quantity = quantities[selectedSize];
    if (quantity > 0 && onAddToCart) {
      onAddToCart({
        productId: product.id,
        size: selectedSize,
        quantity,
      });
    }
  };

  return (
    <Card sx={{ width: 250 }}>
      <img src={product.image} alt={product.name} style={{ width: "100%" }} />
      <CardContent>
        <Typography variant="h6">{product.name}</Typography>
        <Typography variant="subtitle1">{product.price} kr</Typography>

        {/* Storleksknappar */}
        <Stack
          component="div"
          sx={{
            my: 1,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)", // 3 kolumner
            gridAutoRows: "40px", // knapparnas höjd (kan justeras)
            gap: 1, // mellanrum mellan knappar
            minHeight: "96px", // höjd för 3 rader (3 * 40 + 2 * 8)
          }}
        >
          {Object.entries(product.sizes)
            .filter(([_, quantity]) => quantity > 0)
            .map(([size]) => (
              <Button
                key={size}
                variant={selectedSize === size ? "contained" : "outlined"}
                size="small"
                onClick={() => handleSelectSize(size)}
                sx={{
                  width: "100%", // fyller grid-cellen
                  height: "100%", // fyller grid-raden
                  minWidth: "unset", // undviker att knappen blir bredare än cellen
                }}
              >
                {size}
              </Button>
            ))}
        </Stack>

        {/* Antalsväljare */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="center"
          sx={{ mb: 1 }}
        >
          <IconButton
            onClick={() => handleChangeQuantity(-1)}
            size="small"
            sx={{
              minHeight: 32,
              minWidth: 32,
              height: 32,
              width: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            disabled={currentQuantity <= 1}
          >
            <RemoveIcon />
          </IconButton>

          <Typography>{currentQuantity}</Typography>

          <IconButton
            onClick={() => handleChangeQuantity(1)}
            size="small"
            sx={{
              maxHeight: 32,
              maxWidth: 32,
              height: 32,
              width: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            disabled={currentQuantity >= maxAvailable}
          >
            <AddIcon />
          </IconButton>

          <Typography variant="caption" sx={{ ml: 1 }}>
            {maxAvailable - currentQuantity} kvar
          </Typography>
        </Stack>

        <Button
          variant="contained"
          fullWidth
          onClick={handleAddToCart}
          disabled={currentQuantity < 1}
        >
          Lägg till i kundvagn
        </Button>
      </CardContent>
    </Card>
  );
}
