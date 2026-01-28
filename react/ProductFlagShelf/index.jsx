import React, { useMemo } from "react";
import { useProduct } from "vtex.product-context";
import "./index.global.css"; 

const ProductFlagShelf = () => {
  const productContextValue = useProduct();

  const cardTagValue = useMemo(() => {
    const product = productContextValue?.product;
    
    if (!product) {
      return null;
    }

    const properties = product.properties || [];
    
    const cardTagProperty = properties.find((prop) =>
      prop.name?.includes("Card Tag")
    );

    const value = cardTagProperty?.values?.[0] || null;
    
    return value;
  }, [productContextValue]);

  if (!cardTagValue) {
    return null;
  }

  return (
    <div className="product-flag-shelf">
      <span className="card-tag">{cardTagValue}</span>
    </div>
  );
};

export default ProductFlagShelf;
