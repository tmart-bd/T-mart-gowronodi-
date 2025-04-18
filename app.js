// app.js

import { db, storage } from './firebase-config.js';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";

// DOM Elements
const form = document.getElementById('productForm');
const productsContainer = document.getElementById('productsContainer');

// Upload Product
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const imageFile = document.getElementById('productImage').files[0];
  const name = document.getElementById('productName').value;
  const price = document.getElementById('productPrice').value;
  const description = document.getElementById('productDescription').value;

  const storageRef = ref(storage, `products/${imageFile.name}`);
  await uploadBytes(storageRef, imageFile);
  const imageUrl = await getDownloadURL(storageRef);

  await addDoc(collection(db, 'products'), {
    name,
    price,
    description,
    imageUrl,
    imageName: imageFile.name
  });

  form.reset();
  loadProducts();
});

// Load Products
async function loadProducts() {
  productsContainer.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, 'products'));
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const card = document.createElement('div');
    card.classList.add('product-card');

    card.innerHTML = `
      <img src="${data.imageUrl}" alt="${data.name}">
      <h3>${data.name}</h3>
      <p><strong>দাম:</strong> ${data.price} টাকা</p>
      <p>${data.description}</p>
      <button class="delete-btn" data-id="${docSnap.id}" data-img="${data.imageName}">ডিলিট করুন</button>
      <hr>
      <p><strong>মতামত:</strong> (রিভিউ এর জায়গা)</p>
      <p><strong>বার্তা পাঠান:</strong> (মেসেজ সেকশন আসবে)</p>
    `;

    productsContainer.appendChild(card);
  });

  // Delete Button Actions
  const deleteButtons = document.querySelectorAll('.delete-btn');
  deleteButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      const img = btn.getAttribute('data-img');

      await deleteDoc(doc(db, 'products', id));
      const imageRef = ref(storage, `products/${img}`);
      await deleteObject(imageRef);

      loadProducts();
    });
  });
}

// Start loading products on page load
loadProducts();