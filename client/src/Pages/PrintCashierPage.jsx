import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TopBar from "../components/TopBar";
import ProductGrid from "../components/ProductGrid";

export default function PrintCashierPage() {
  const [products, setProducts] = useState([]);
  const CATEGORY = "mua bán";

  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then((res) => res.json())
      .then((data) => {
        const productArray = Array.isArray(data) ? data : data.products || [];
        const filtered = productArray.filter(
          (p) =>
            p.category?.toLowerCase() === "mua" ||
            p.category?.toLowerCase() === "bán"
        );
        setProducts(filtered);
      })
      .catch((error) => {
        console.error("Lỗi khi fetch sản phẩm:", error);
      });
  }, []);


  return (
    <div className="font-sans">
      <div className="pt-[140px]">
        <TopBar />

        {/* Breadcrumb navigation */}
        <div className="text-sm text-gray-600 px-6 py-3">
          <Link
            to="/"
            className="text-gray-600 hover:text-orange-500 hover:underline cursor-pointer transition-colors duration-200"
          >
            Trang chủ
          </Link>
          <span className="mx-1">&gt;</span>
          <span className="text-orange-500 font-medium">{CATEGORY}</span>
        </div>

        {/* Hiển thị danh sách sản phẩm */}
        <ProductGrid products={products} repeatCount={4} />
      </div>
    </div>
  );
}
