import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [imageUrl, setImageUrl] = useState("");
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/product/${id}`
        );
        setProduct(response.data);
        if (response.data.imageName) {
          fetchImage();
        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchImage = async () => {
      const response = await axios.get(
        `http://localhost:8080/api/product/${id}/image`,
        { responseType: "blob" }
      );
      setImageUrl(URL.createObjectURL(response.data));
    };
    fetchProduct();
  }, [id]);

  const deleteProduct = async (id) => {
    console.log(id);
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/product/${id}`
      );
      navigate("/");
      console.log(response.status);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(product.name);
  return (
    <>
      <div className="containers">
        <img
          className="left-column-img"
          src={imageUrl}
          alt={product.imageName}
          style={{ width: "50%", height: "auto" }}
        />
        <div className="right-column">
          <div className="product-description">
            <span>{product.category}</span>
            <h1>{product.name}</h1>
            <h5>{product.brand}</h5>
            <p>{product.description}</p>
          </div>

          <div className="product-price">
            <span>{"$" + product.price}</span>
            <h6>
              Stock Available :{" "}
              <i style={{ color: "green", fontWeight: "bold" }}>
                {product.quantity}
              </i>
            </h6>
          </div>
          <div className="update-button ">
            <Link to={`/update/${id}`}>
              <button className="btn btn-primary" type="button">
                Update
              </button>
            </Link>

            <button
              className="btn btn-primary"
              type="button"
              onClick={() => deleteProduct(id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Product;
