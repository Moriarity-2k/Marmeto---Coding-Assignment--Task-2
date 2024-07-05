/**
 * Fetches product details asynchronously from the given URL
 * @returns Product details
 */

async function getProducts() {
	const response = await fetch(
		"https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json"
	);
	if (!response.ok) {
		throw new Error("Failed to fetch product details");
	}
	const result = await response.json();

	/**
     * Basic product JSON Format
     {
        id: '1',
        title: 'Mens Kurta',
        price: '1199',
        compare_at_price: '1299',
        vendor: 'Manyvar',
        badge_text: 'Wedding Special',
        image: 'https://plus.unsplash.com/premium_photo-1682090786689-741d60a11384',
        second_image: 'https://plus.unsplash.com/premium_photo-1682090781379-4d177df45267'
     },
     */

	return result.categories;
}

/**
 * Calculates the discount percentage
 * @param {number} initialPrice
 * @param {number} finalPrice
 * @returns {number} The discount percentage
 */
function calculateDiscount(initialPrice, finalPrice) {
	const discount = Math.round(
		((initialPrice - finalPrice) / initialPrice) * 100
	);

	return discount;
}

/**
 * formats the name depending upon the length of it
 * @param {string} name
 * @returns name
 */
function formatName(name) {
	if (name.length <= 13) {
		return name;
	} else {
		return name.substring(0, 10) + "...";
	}
}

class Proudcts {
	currentCategory = "Men";
	allProducts;

	constructor() {
		this.init();
	}

	/**
	 * Initializes the product data and renders categories
	 */
	async init() {
		try {
			const allCategories = await getProducts();
			this.allProducts = allCategories.reduce(
				(acc, { category_name, category_products }) => {
					acc[category_name] = category_products;
					return acc;
				},
				{}
			);
			this.renderCategories();
		} catch (error) {
			console.error("Error initializing products:", error);
		}
	}

	/**
	 * Renders the category buttons
	 */
	renderCategories() {
		const categoriesContainer = document.querySelector(".categories");
		const categoryHtml = Object.keys(this.allProducts)
			.map(
				(key) =>
					`<div class="category ${
						key === this.currentCategory ? "active" : ""
					}" data-category="${key}">${key}</div>`
			)
			.join("");
		categoriesContainer.innerHTML = categoryHtml;

		const categoriesVariants = document.querySelectorAll(".category");

		categoriesContainer.addEventListener("click", (e) => {
			const selectedCategory = e.target.getAttribute("data-category");
			if (!selectedCategory || this.currentCategory === selectedCategory)
				return;
			this.currentCategory = selectedCategory;

            /**
             * selecting the category variants and changing it's styles 
             */
			categoriesVariants.forEach((x) => {
				if (x.getAttribute("data-category") === this.currentCategory) {
					if (!x.classList.contains("active"))
						x.classList.add("active");
				} else {
					if (x.classList.contains("active"))
						x.classList.remove("active");
				}

				this.renderProducts();
			});
		});

		this.renderProducts();
	}

	renderProducts() {
		const productsContainer = document.querySelector(".products-container");

		let productsHtml = "";

		for (const key in this.allProducts) {
			if (key !== this.currentCategory) continue;
			const productDetails = this.allProducts[key];

			for (const productDetail of productDetails) {
				productsHtml += `
                <div class="products">
                    <div class="product-image" style="background-image : url(${
						productDetail.image
					})">
                        <div class="product-badge" style="display: ${
							productDetail.badge_text == null ? "none" : "block"
						};">${productDetail.badge_text}</div>
                    </div>
    
                    <div class="product-desc">
                        <div class="product-title">${formatName(
							productDetail.title
						)}</div>
                        <div class="product-seperator"></div>
                        <div class="product-vendor">${formatName(
							productDetail.vendor
						)}</div>
                    </div>
    
                    <div class="product-price-container">
                        <div class="price-final">Rs ${(+productDetail.price).toFixed(
							2
						)}</div>
                        <div class="price-original">${(+productDetail.compare_at_price).toFixed(
							2
						)}</div>
                        <div class="price-discount">${
							(calculateDiscount(+productDetail.compare_at_price),
							+productDetail.price)
						}</div>
                    </div>
    
                    <div class="add-to-cart">Add to Cart</div>
                </div>
                `;
			}
		}

		productsContainer.innerHTML = productsHtml;
		// productsContainer.insertAdjacentHTML("af terbegin", html);
	}
}

const product = new Proudcts();
