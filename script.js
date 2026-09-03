const products=[
{id:1,name:"Classic Linen Shirt",category:"fashion",price:1299,old:1799,img:"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=75"},
{id:2,name:"Minimal Sneakers",category:"shoes",price:2199,old:2999,img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=75"},
{id:3,name:"Everyday Backpack",category:"accessories",price:1599,old:1999,img:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=75"},
{id:4,name:"Premium Hoodie",category:"fashion",price:1899,old:2399,img:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=75"},
{id:5,name:"Urban Watch",category:"accessories",price:2499,old:3299,img:"https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=700&q=75"},
{id:6,name:"Street Runner",category:"shoes",price:2799,old:3499,img:"https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&q=75"},
{id:7,name:"Relaxed T-Shirt",category:"fashion",price:799,old:999,img:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=75"},
{id:8,name:"Leather Crossbody",category:"accessories",price:1399,old:1799,img:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=75"}
];

let cart=JSON.parse(localStorage.getItem("shopease-cart")||"[]");
const grid=document.getElementById("productGrid"),empty=document.getElementById("emptyState");
const money=n=>"₹"+n.toLocaleString("en-IN");

function renderProducts(list=products){
  grid.innerHTML=list.map(p=>`<article class="product">
    <div class="product-img"><img loading="lazy" src="${p.img}" alt="${p.name}"><span class="badge">SALE</span></div>
    <div class="product-info"><span class="category">${p.category}</span><h3>${p.name}</h3>
    <div class="price">${money(p.price)} <span class="old">${money(p.old)}</span></div>
    <button class="add" onclick="addToCart(${p.id})">Add to Cart</button></div>
  </article>`).join("");
  empty.style.display=list.length?"none":"block";
}
function saveCart(){localStorage.setItem("shopease-cart",JSON.stringify(cart));renderCart()}
function addToCart(id){
  const found=cart.find(x=>x.id===id);
  found?found.qty++:cart.push({id,qty:1});
  saveCart();toast("Added to cart ✓");openCart();
}
function changeQty(id,delta){
  const item=cart.find(x=>x.id===id); if(!item)return;
  item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);saveCart();
}
function renderCart(){
  document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);
  const box=document.getElementById("cartItems");
  if(!cart.length){box.innerHTML='<p style="text-align:center;color:#647474;padding:50px 10px">Your cart is empty 🛒</p>'}
  else box.innerHTML=cart.map(item=>{const p=products.find(x=>x.id===item.id);return `<div class="cart-row">
    <img src="${p.img}" alt="${p.name}"><div><h4>${p.name}</h4><p>${money(p.price)}</p><div class="qty">
    <button onclick="changeQty(${p.id},-1)">−</button><b>${item.qty}</b><button onclick="changeQty(${p.id},1)">+</button></div></div>
    <button class="remove" onclick="changeQty(${p.id},-${item.qty})">Remove</button></div>`}).join("");
  const total=cart.reduce((s,x)=>s+(products.find(p=>p.id===x.id).price*x.qty),0);
  document.getElementById("cartTotal").textContent=money(total);
}
function openCart(){document.getElementById("cartPanel").classList.add("open");document.getElementById("overlay").classList.add("show")}
function closeCart(){document.getElementById("cartPanel").classList.remove("open");document.getElementById("overlay").classList.remove("show")}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}

document.getElementById("cartBtn").onclick=openCart;
document.getElementById("closeCart").onclick=closeCart;
document.getElementById("overlay").onclick=closeCart;
document.getElementById("menuBtn").onclick=()=>document.getElementById("navLinks").classList.toggle("open");
document.getElementById("searchBtn").onclick=()=>{const s=document.getElementById("searchBox");s.classList.toggle("open");if(s.classList.contains("open"))document.getElementById("searchInput").focus()};
document.getElementById("searchInput").oninput=e=>{
 const q=e.target.value.toLowerCase().trim();
 renderProducts(products.filter(p=>p.name.toLowerCase().includes(q)||p.category.includes(q)));
};
document.getElementById("filters").onclick=e=>{
 if(!e.target.classList.contains("filter"))return;
 document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));e.target.classList.add("active");
 const c=e.target.dataset.category;renderProducts(c==="all"?products:products.filter(p=>p.category===c));
};
document.getElementById("checkout").onclick=()=>{
 if(!cart.length){toast("Your cart is empty");return}
 toast("Demo checkout completed ✓");cart=[];saveCart();setTimeout(closeCart,600);
};
renderProducts();renderCart();
