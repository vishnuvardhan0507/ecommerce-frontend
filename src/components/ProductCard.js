import { Card, CardMedia, CardContent, Typography, Button, CardActions } from "@mui/material";
import api from "../api";
import { getUser, getToken } from "../utils/auth";

export default function ProductCard({ product, onAddToCart }) {
  const user = getUser();

  const addToCart = async () => {
    try {
      await api.post("/cart/add", {
        userId: user.id,
        productId: product.id
      }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });

      alert(`${product.name} added to cart`);
      if (onAddToCart) onAddToCart();
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart");
    }
  };

  return (
    <Card sx={{ maxWidth: 250, margin: 2, borderRadius: 3, boxShadow: 3 }}>
      <CardMedia
        component="img"
        height="180"
        image={product.imageUrl || "https://via.placeholder.com/150"}
        alt={product.name}
      />
      <CardContent>
        <Typography variant="h6">{product.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          ₹{product.price}
        </Typography>
      </CardContent>
      <CardActions>
        <Button 
          size="small" 
          variant="contained" 
          color="primary" 
          onClick={addToCart}
          fullWidth
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
}
