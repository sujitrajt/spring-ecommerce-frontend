import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/products");
        const fetchedProducts = response.data;

        // Fetch image after product data is fetched
        const updatedProducts = await Promise.all(
          fetchedProducts.map(async (product) => {
            const imageUrl = await fetchImage(product.id);
            return { ...product, imageUrl };
          })
        );

        setProducts(updatedProducts); // Set products with image URLs
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsError(true);
      }
    };

    const fetchImage = async (productId) => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/product/${productId}/image`,
          { responseType: "blob" }
        );
        const imageUrl = URL.createObjectURL(response.data);
        return imageUrl; // Return the image URL
      } catch (error) {
        console.error(
          `Error fetching image for product ID ${productId}:`,
          error
        );
        return "placeholder-image-url"; // Return a placeholder if image fetch fails
      }
    };

    fetchData();
  }, []);

  if (isError) {
    return (
      <h2 className="text-center" style={{ padding: "10rem" }}>
        Something went wrong...
      </h2>
    );
  }

  return (
    <>
      <div className="grid">
        {products.map((product) => (
          <div
            className="card mb-3"
            key={product.id}
            style={{
              width: "270px",
              height: "300px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              borderRadius: "10px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "stretch",
            }}
          >
            <Link
              to={`/product/${product.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img
                src={product.imageUrl} // Use the imageUrl from the product object
                alt={product.imageName}
                style={{
                  width: "100%",
                  height: "100px",
                  objectFit: "cover",
                  padding: "5px",
                  margin: "0",
                }}
              />
              <div
                className="card-body"
                style={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "10px",
                }}
              >
                <div>
                  <h5
                    className="card-title"
                    style={{ margin: "0 0 10px 0", fontSize: "1.2rem" }}
                  >
                    {product.name.toUpperCase()}
                  </h5>
                  <i
                    className="card-brand"
                    style={{ fontStyle: "italic", fontSize: "0.8rem" }}
                  >
                    {"by " + product.brand}
                  </i>
                </div>
                <hr className="hr-line" style={{ margin: "10px 0" }} />
                <div className="home-cart-price">
                  <h5
                    className="card-text"
                    style={{
                      fontWeight: "600",
                      fontSize: "1.1rem",
                      marginBottom: "5px",
                    }}
                  >
                    <i className="bi bi-currency-dollar"></i>
                    {product.price}
                  </h5>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
