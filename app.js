// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyC4_YoA01AN3jEwbQAXyw6Q7GFty1g9BHg",
  authDomain: "t-mart-gowronodi.firebaseapp.com",
  projectId: "t-mart-gowronodi",
  storageBucket: "t-mart-gowronodi.appspot.com",
  messagingSenderId: "1000488120347",
  appId: "1:1000488120347:web:d003c1562051aa2e2d08be",
  measurementId: "G-10M2C230N5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// Submit Product
document.getElementById("productForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("productName").value;
  const price = document.getElementById("productPrice").value;
  const description = document.getElementById("productDescription").value;
  const imageFile = document.getElementById("productImage").files[0];

  if (!name || !price || !description || !imageFile) {
    alert("সব ইনপুট পূর্ণ করুন!");
    return;
  }

  const storageRef = storage.ref("products/" + imageFile.name);
  await storageRef.put(imageFile);
  const imageUrl = await storageRef.getDownloadURL();

  await db.collection("products").add({
    name,
    price,
    description,
    imageUrl,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  alert("প্রোডাক্ট সফলভাবে যোগ হয়েছে!");
  document.getElementById("productForm").reset();
  loadProducts();
});

// Load Products
async function loadProducts() {
  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = "";

  const snapshot = await db.collection("products").orderBy("timestamp", "desc").get();
  snapshot.forEach(doc => {
    const data = doc.data();
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${data.imageUrl}" alt="${data.name}">
      <h3>${data.name}</h3>
      <p class="price">৳${data.price}</p>
      <p>${data.description}</p>
      <button class="delete-btn" onclick="deleteProduct('${doc.id}', '${data.imageUrl}')">Delete</button>
    `;
    productsContainer.appendChild(card);
  });
}

// Delete Product
async function deleteProduct(id, imageUrl) {
  if (confirm("আপনি কি প্রোডাক্টটি মুছে ফেলতে চান?")) {
    // Delete from Firestore
    await db.collection("products").doc(id).delete();

    // Delete from Storage
    const imageRef = storage.refFromURL(imageUrl);
    await imageRef.delete();

    alert("প্রোডাক্ট মুছে ফেলা হয়েছে!");
    loadProducts();
  }
}

// Load products on page load
window.onload = loadProducts;