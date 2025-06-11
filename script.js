let groceryList = JSON.parse(localStorage.getItem("groceryList")) || [];
let editingIndex = null;

function saveToStorage() {
  localStorage.setItem("groceryList", JSON.stringify(groceryList));
}

function addItem() {
  const item = document.getElementById("itemInput").value.trim();
  const qty = document.getElementById("quantityInput").value.trim();
  const category = document.getElementById("categorySelect").value;

  if (item === "" || category === "" || qty === "") {
    alert("Please fill all fields.");
    return;
  }

  const timestamp = new Date().toLocaleString();

  groceryList.push({
    name: item,
    quantity: qty,
    category: category,
    addedAt: timestamp,
    purchased: false
  });

  document.getElementById("itemInput").value = "";
  document.getElementById("quantityInput").value = "";
  document.getElementById("categorySelect").value = "";
  saveToStorage();
  renderList();
}

function deleteItem(index) {
  groceryList.splice(index, 1);
  saveToStorage();
  renderList();
}

function editItem(index) {
  editingIndex = index;
  const item = groceryList[index];
  document.getElementById("editItemName").value = item.name;
  document.getElementById("editItemQty").value = item.quantity;
  document.getElementById("editItemCategory").value = item.category;
  document.getElementById("editModal").style.display = "block";
}

function saveEdit() {
  const name = document.getElementById("editItemName").value.trim();
  const qty = document.getElementById("editItemQty").value.trim();
  const category = document.getElementById("editItemCategory").value;

  if (name === "" || category === "" || qty === "") {
    alert("Please fill all fields.");
    return;
  }

  groceryList[editingIndex].name = name;
  groceryList[editingIndex].quantity = qty;
  groceryList[editingIndex].category = category;
  saveToStorage();
  renderList();
  closeModal();
}

function closeModal() {
  document.getElementById("editModal").style.display = "none";
}

function togglePurchased(index) {
  groceryList[index].purchased = !groceryList[index].purchased;
  saveToStorage();
  renderList();
}

function clearList() {
  if (confirm("Are you sure you want to clear the entire list?")) {
    groceryList = [];
    saveToStorage();
    renderList();
  }
}

function renderList() {
  const searchQuery = document.getElementById("searchInput").value.toLowerCase();
  const listEl = document.getElementById("groceryList");
  listEl.innerHTML = "";

  groceryList
    .filter(item =>
      item.name.toLowerCase().includes(searchQuery) ||
      item.category.toLowerCase().includes(searchQuery)
    )
    .forEach((item, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="item-details ${item.purchased ? 'purchased' : ''}">
          <strong>${item.name}</strong> (Qty: ${item.quantity}, ${item.category})<br>
          <span class="item-meta">Added: ${item.addedAt}</span>
        </div>
        <div class="btn-group">
          <button onclick="togglePurchased(${index})">
            ${item.purchased ? 'Unmark' : 'Purchased'}
          </button>
          <button onclick="editItem(${index})">Edit</button>
          <button onclick="deleteItem(${index})" style="background:#f44336;color:white;">Delete</button>
        </div>
      `;
      listEl.appendChild(li);
    });
}

renderList();
