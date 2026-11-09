const products = [
  {id:1,name:"Velvet Kiss Lip Gloss",category:"Makeup",description:"A glossy, comfortable finish for an effortlessly polished look.",price:8500,icon:"💋"},
  {id:2,name:"Daily Glow Cleanser",category:"Skincare",description:"A gentle-feeling daily cleanser to refresh your routine.",price:12000,icon:"🫧"},
  {id:3,name:"Petal Bloom Mist",category:"Fragrance",description:"A soft floral-inspired scent for your everyday moments.",price:10500,icon:"🌷"},
  {id:4,name:"Soft Touch Brush Set",category:"Beauty tools",description:"Easy-to-use essentials to help you blend and create.",price:15000,icon:"🖌️"}
];
const cart = new Map();
const naira = value => `₦${value.toLocaleString("en-NG")}`;

function renderProducts() {
  document.querySelector("#products").innerHTML = products.map(p => `
    <article class="product">
      <div class="product-art" aria-hidden="true">${p.icon}</div>
      <div class="product-info">
        <span class="tag">${p.category}</span><h3>${p.name}</h3><p>${p.description}</p>
        <div class="product-bottom"><span class="price">${naira(p.price)}</span>
        <button class="add" data-add="${p.id}">Add to bag +</button></div>
      </div>
    </article>`).join("");
}

function renderCart() {
  const entries = [...cart.entries()];
  const count = entries.reduce((sum, [, qty]) => sum + qty, 0);
  const subtotal = entries.reduce((sum, [id, qty]) => sum + products.find(p => p.id === id).price * qty, 0);
  document.querySelector("#cart-count").textContent = count;
  document.querySelector("#subtotal").textContent = naira(subtotal);
  document.querySelector("#cart-items").innerHTML = entries.length ? entries.map(([id, qty]) => {
    const p = products.find(item => item.id === id);
    return `<div class="cart-row"><div><strong>${p.name}</strong><small>${naira(p.price)} each</small></div>
      <div class="qty"><button data-change="${id}" data-step="-1" aria-label="Remove one">−</button>
      <span>${qty}</span><button data-change="${id}" data-step="1" aria-label="Add one">+</button></div></div>`;
  }).join("") : '<p class="empty">Your bag is waiting for a little beauty magic ✨</p>';
}

function changeQty(id, step) {
  const qty = (cart.get(id) || 0) + step;
  if (qty <= 0) cart.delete(id); else cart.set(id, qty);
  renderCart();
}
function openCart() { document.querySelector("#backdrop").classList.add("open"); }
function closeCart() { document.querySelector("#backdrop").classList.remove("open"); }

document.addEventListener("click", event => {
  const add = event.target.closest("[data-add]");
  const change = event.target.closest("[data-change]");
  if (add) changeQty(Number(add.dataset.add), 1);
  if (change) changeQty(Number(change.dataset.change), Number(change.dataset.step));
});
document.querySelector("#open-cart").addEventListener("click", openCart);
document.querySelector("#close-cart").addEventListener("click", closeCart);
document.querySelector("#backdrop").addEventListener("click", event => {
  if (event.target.id === "backdrop") closeCart();
});
document.querySelector("#checkout").addEventListener("click", () => {
  if (!cart.size) { alert("Your bag is empty. Add a product first!"); return; }
  const lines = [...cart.entries()].map(([id, qty]) => {
    const p = products.find(item => item.id === id);
    return `${p.name} x ${qty} — ${naira(p.price * qty)}`;
  });
  const subtotal = [...cart.entries()].reduce((sum, [id, qty]) => sum + products.find(p => p.id === id).price * qty, 0);
  alert(`Thanks for shopping with Veloura Beauty!\n\nDemo order:\n${lines.join("\n")}\n\nSubtotal: ${naira(subtotal)}\n\nReal payment processing is not connected yet.`);
});
const menuButton = document.querySelector("#menu-toggle");
const nav = document.querySelector("#nav");
menuButton.addEventListener("click", () => nav.classList.toggle("open"));
nav.addEventListener("click", event => { if (event.target.closest("a")) nav.classList.remove("open"); });
document.querySelector("#year").textContent = new Date().getFullYear();
renderProducts();
renderCart();
