const BASE_URL = "http://localhost:3000/contact";

//function onload,,,,,fetch api call method
window.onload = function () {
  let tbody = document.querySelector("#tbody");
  fetch(BASE_URL)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((contact) => {
        console.log(contact);
        createTdElement(contact, tbody);
      });
    })
    .catch((error) => {
      // handle the error
    });

  let saveContactBtn = document.querySelector("#saveContact");
  saveContactBtn.addEventListener("click", function () {
    saveNewContact();
  });
};

// save new contact function with fetch api
function saveNewContact() {
  let fullName = document.querySelector("#fullName");
  let email = document.querySelector("#email");
  let phone = document.querySelector("#phone");

  let contact = {
    name: fullName.value,
    email: email.value,
    phone: phone.value,
  };

  let tbody = document.querySelector("#tbody");

  fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contact),
  })
    .then((res) => res.json())
    .then((contact) => {
      createTdElement(contact, tbody);
    })
    .catch((err) => {
      console.log("Error: ", err);
    });

  fullName.value = "";
  email.value = "";
  phone.value = "";
}

function createTdElement(contact, parentElement) {
  const tr = document.createElement("tr");

  const tdName = document.createElement("td");
  tdName.innerHTML = contact.name ? contact.name : "N/A";
  tr.appendChild(tdName);

  const tdEmail = document.createElement("td");
  tdEmail.innerHTML = contact.email ? contact.email : "N/A";
  tr.appendChild(tdEmail);

  const tdPhone = document.createElement("td");
  tdPhone.innerHTML = contact.phone ? contact.phone : "N/A";
  tr.appendChild(tdPhone);

  const tdAction = document.createElement("td");

  const tdEditBtn = document.createElement("button");
  tdEditBtn.className = "btn btn-warning";

  tdEditBtn.innerHTML = "Edit";
  tdEditBtn.addEventListener("click", function () {
    console.log("I am edit button");

    let myModal = new bootstrap.Modal("#editContactModal");
    window.addEventListener("click", () => {
      myModal.show();
    });
    let editId = document.querySelector("#id");
    let editName = document.querySelector("#editName");
    let editEmail = document.querySelector("#editEmail");
    let editPhone = document.querySelector("#editPhone");
    editId.value = contact.id;
    editName.value = contact.name ? contact.name : "";
    editEmail.value = contact.email ? contact.email : "";
    editPhone.value = contact.phone ? contact.phone : "";

    // here started the update code
    let updateForm = document.getElementById("update_contact");
    // console.log(updateForm);
    const updateValue = {};
    updateForm.addEventListener("submit", (e) => {
      e.preventDefault();
      id = e.target.id.value;
      updateValue.name = e.target.name.value;
      updateValue.email = e.target.email.value;
      updateValue.phone = e.target.phone.value;

      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateValue),
      };
      fetch(`${BASE_URL}/${id}`, requestOptions)
        .then((res) => res.json())
        .then((res) => {
          tdName.innerHTML = res.name;
          tdEmail.innerHTML = res.email;
          tdPhone.innerHTML = res.phone;
          myModal.hide();
          window.location.reload();
        })
        .catch((err) => console.log("Error: ", err));
    });
  });
  tdAction.appendChild(tdEditBtn);

  const tdDeleteBtn = document.createElement("button");
  tdDeleteBtn.className = "btn btn-danger mx-1";
  tdDeleteBtn.setAttribute("for", contact.id);
  tdDeleteBtn.innerHTML = "Delete";
  tdDeleteBtn.addEventListener("click", function () {
    console.log("I am delete button");

    fetch(`${BASE_URL}/${contact.id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((res) => {
        parentElement.removeChild(tr);
      })
      .catch((err) => console.log("Error: ", err));
  });
  tdAction.appendChild(tdDeleteBtn);
  tr.appendChild(tdAction);

  parentElement.appendChild(tr);
}


// close button bug fix
let closeModal = document.querySelector('#closeModal');
closeModal.addEventListener('click',function(){
  window.location.reload()
})