// Load products data and render product detail page
let productsData = {};

// Fetch products data
fetch("assets/js/products.json")
  .then((response) => response.json())
  .then((data) => {
    productsData = data.products;
    loadProduct();
  })
  .catch((error) => console.error("Error loading products:", error));

// Get product ID from URL
function getProductId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id") || "meranti";
}

// Load and render product
function loadProduct() {
  const productId = getProductId();
  const product = productsData[productId];

  if (!product) {
    document.body.innerHTML =
      "<div style='padding: 40px; text-align: center;'><h1>Produk tidak ditemukan</h1></div>";
    return;
  }

  // Update meta tags
  document.querySelector("title").textContent =
    `${product.name} - PD Sumber Jaya`;

  // Update breadcrumb
  document.getElementById("breadcrumb-product").textContent = product.name;

  // Update image
  const productImage = document.getElementById("product-image");
  productImage.src = product.image;
  productImage.alt = product.name;

  // Update product info
  document.getElementById("product-name").textContent = product.name;
  document.getElementById("product-subtitle").textContent = product.subtitle;
  document.getElementById("product-description").textContent =
    product.description;

  // Update specs
  const specsHTML = product.specs
    .map(
      (spec) => `
      <div class="flex justify-between border-b border-gray-300 dark:border-gray-600 pb-3">
        <span class="font-bold text-gray-700 dark:text-gray-300">${spec.label}</span>
        <span class="text-right text-primary">${spec.value}</span>
      </div>
    `,
    )
    .join("");
  document.getElementById("product-specs").innerHTML = specsHTML;

  // Update benefits
  const benefitsHTML = product.benefits
    .map(
      (benefit) => `
      <li class="flex items-start gap-3">
        <span class="material-symbols-outlined text-primary mt-1 flex-shrink-0">check_circle</span>
        <span class="text-gray-700 dark:text-gray-300">${benefit}</span>
      </li>
    `,
    )
    .join("");
  document.getElementById("product-benefits").innerHTML = benefitsHTML;

  // Related products (exclude current product)
  const relatedProductIds = Object.keys(productsData).filter(
    (id) => id !== productId,
  );
  const relatedHTML = relatedProductIds
    .slice(0, 4)
    .map((id) => {
      const relatedProduct = productsData[id];
      return `
      <div class="bg-white dark:bg-background-dark rounded shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div class="h-40 bg-gray-200 overflow-hidden">
          <img src="${relatedProduct.image}" alt="${relatedProduct.name}" class="w-full h-full object-cover" />
        </div>
        <div class="p-4">
          <h4 class="font-bold text-[#0e121b] dark:text-white mb-2">${relatedProduct.name}</h4>
          <a href="product-detail.html?id=${id}" class="text-primary text-sm font-bold hover:underline">
            Lihat Detail →
          </a>
        </div>
      </div>
    `;
    })
    .join("");
  document.getElementById("related-products").innerHTML = relatedHTML;
}
