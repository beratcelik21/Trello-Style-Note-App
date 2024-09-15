// Yeni kart ekleme işlemi
const addCardButtons = document.querySelectorAll('.add-card');
let draggedCard = null;

addCardButtons.forEach(button => {
  button.addEventListener('click', () => {
    const newCard = document.createElement('div');
    newCard.classList.add('card');
    newCard.setAttribute('draggable', 'true');
    newCard.innerHTML = `
      <textarea class="note" placeholder="Not girin..."></textarea>
      <button class="save-card">Kaydet</button>
      <button class="delete-card">Sil</button>`;
    
    button.parentElement.appendChild(newCard);

    // Sürükle bırak işlemlerini ekle
    addDragAndDrop(newCard);

    // Kaydet butonuna işlev ekle
    const saveButton = newCard.querySelector('.save-card');
    saveButton.addEventListener('click', () => {
      saveToLocalStorage();
      alert("Not kaydedildi!");
    });

    // Kart silme işlevi
    const deleteButton = newCard.querySelector('.delete-card');
    deleteButton.addEventListener('click', () => {
      newCard.remove();
      saveToLocalStorage();
    });

    saveToLocalStorage(); // Güncel durumu kaydet
  });
});

// Sürükle bırak işlemlerini eklemek için fonksiyon
function addDragAndDrop(card) {
  card.addEventListener('dragstart', () => {
    draggedCard = card;
    setTimeout(() => {
      card.style.display = 'none';
    }, 0);
  });

  card.addEventListener('dragend', () => {
    setTimeout(() => {
      card.style.display = 'block';
      draggedCard = null;
    }, 0);
  });

  document.querySelectorAll('.list').forEach(list => {
    list.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    list.addEventListener('drop', () => {
      if (draggedCard) {
        list.appendChild(draggedCard);
        saveToLocalStorage(); // Güncel durumu kaydet
      }
    });
  });
}

// Kartları LocalStorage'a kaydetme
function saveToLocalStorage() {
  const lists = document.querySelectorAll('.list');
  let data = [];
  lists.forEach(list => {
    let cards = [];
    list.querySelectorAll('.card').forEach(card => {
      const noteContent = card.querySelector('.note').value;
      cards.push(noteContent);
    });
    data.push(cards);
  });
  localStorage.setItem('boardData', JSON.stringify(data));
}

// Sayfa yüklendiğinde LocalStorage'dan verileri geri yükleme
window.addEventListener('load', () => {
  const savedData = JSON.parse(localStorage.getItem('boardData'));
  if (savedData) {
    savedData.forEach((cards, index) => {
      const list = document.querySelectorAll('.list')[index];
      cards.forEach(noteContent => {
        const newCard = document.createElement('div');
        newCard.classList.add('card');
        newCard.setAttribute('draggable', 'true');
        newCard.innerHTML = `
          <textarea class="note">${noteContent}</textarea>
          <button class="save-card">Kaydet</button>
          <button class="delete-card">Sil</button>`;
        
        list.appendChild(newCard);

        // Sürükle bırak işlemlerini ekle
        addDragAndDrop(newCard);

        // Kaydet butonuna işlev ekle
        const saveButton = newCard.querySelector('.save-card');
        saveButton.addEventListener('click', () => {
          saveToLocalStorage();
          alert("Not kaydedildi!");
        });

        // Silme butonunu ekle
        const deleteButton = newCard.querySelector('.delete-card');
        deleteButton.addEventListener('click', () => {
          newCard.remove();
          saveToLocalStorage();
        });
      });
    });
  }
});
