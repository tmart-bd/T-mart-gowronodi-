// app.js

import { db, storage } from "./firebase-config.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";

// Product Upload
const form = document.getElementById("productForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("productName").value;
  const price = document.getElementById("productPrice").value;
  const description = document.getElementById("productDescription").value;
  const imageFile = document.getElementById("productImage").files[0];

  if (!name || !price || !description || !imageFile) {
    alert("সব তথ্য দিন!");
    return;
  }

  // Upload image to storage
  const storageRef = ref(storage, `products/${imageFile.name}`);
  await uploadBytes(storageRef, imageFile);
  const imageUrl = await getDownloadURL(storageRef);

  // Save to Firestore
  await addDoc(collection(db, "products"), {
    name,
    price,
    description,
    imageUrl,
    imageName: imageFile.name,
    timestamp: serverTimestamp()
  });

  alert("প্রোডাক্ট আপলোড হয়েছে!");
  form.reset();
  loadProducts();
});

// Show Products
async function loadProducts() {
  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = "";

  const q = query(collection(db, "products"), orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${data.imageUrl}" alt="${data.name}">
      <h3>${data.name}</h3>
      <p class="price">৳${data.price}</p>
      <p>${data.description}</p>
      <button class="delete-btn" onclick="deleteProduct('${docSnap.id}', '${data.imageName}')">Delete</button>
    `;

    productsContainer.appendChild(card);
  });
}

// Delete Product
window.deleteProduct = async function (id, imageName) {
  if (confirm("আপনি কি ডিলিট করতে চান?")) {
    await deleteDoc(doc(db, "products", id));
    const imageRef = ref(storage, `products/${imageName}`);
    await deleteObject(imageRef);
    loadProducts();
  }
};

// Page Load
window.onload = loadProducts;