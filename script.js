document
  .getElementById("repairForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const data = {
      name: document.getElementById("name").value,
      phone: document.getElementById("phone").value,
      reference: document.getElementById("reference").value,
      details: document.getElementById("details").value,
      price: document.getElementById("price").value,
      deposit: document.getElementById("deposit").value,
      status: document.getElementById("status").value,
      entryDate: document.getElementById("entryDate").value,
      //deliveryDate: document.getElementById("deliveryDate").value,
    };
    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Registro exitoso");
        document.getElementById("repairForm").reset();
        loadRepairs();
      } else {
        alert("Error en el registro");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error en la solicitud");
    }
  });
document
  .getElementById("editForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const data = {
      name: document.getElementById("editName").value,
      phone: document.getElementById("editPhone").value,
      reference: document.getElementById("editReference").value,
      details: document.getElementById("editDetails").value,
      price: document.getElementById("editPrice").value,
      deposit: document.getElementById("editDeposit").value,
      status: document.getElementById("editStatus").value,
      entryDate: document.getElementById("editEntryDate").value,
      repairDate: document.getElementById("editRepairDate").value,
      //deliveryDate: document.getElementById("editDeliveryDate").value,
    };
    const id = document.getElementById("editId").value;
    try {
      const response = await fetch(`http://localhost:3000/repairs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log(data.repair_date);
        alert(`Reparación actualizada exitosamente con id ${id}`);
        document.getElementById("editForm").reset();
        hideEditForm();
        loadRepairs();
      } else {
        alert(`Error al actualizar la reparación con id ${id}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error en la solicitud EDOCOPM");
    }
  });

async function loadRepairs() {
  try {
    const response = await fetch("http://localhost:3000/repairs");
    const repairs = await response.json();
    displayRepairs(repairs);
  } catch (error) {
    console.error("Error:", error);
    alert("Error al obtener los datos");
  }
}

async function filterRepairs() {
  const status = document.getElementById("filterStatus").value;
  const url = status
    ? `http://localhost:3000/repairs/status/${status}`
    : "http://localhost:3000/repairs";

  try {
    const response = await fetch(url);
    const repairs = await response.json();
    displayRepairs(repairs);
    console.log(status);
  } catch (error) {
    console.error("Error:", error);
    alert("Error al filtrar los datos");
  }
}

async function searchRepairs() {
  const query = document.getElementById("searchQuery").value;
  console.log("en funcion searchRepairs()");
  if (query.length < 3) {
    loadRepairs();
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/repairs/search?query=${query}`
    );
    const repairs = await response.json();
    displayRepairs(repairs);
  } catch (error) {
    console.error("Error:", error);
    alert("Error al buscar las reparaciones");
  }
}

// Función para formatear números
function formatNumber(number) {
  return new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(number);
}
// funcion para dar formato a las fechas.
function formatDate(dateString) {
  if (!dateString) return "";
  // var n = new Date();
  // var y = n.getFullYear();
  // var m = 12;
  // var d = 31;
  // var newfecha = `${y}-${m}-${d}`;
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES");
}

function showDetails(details) {
  document.getElementById("Details").value = details || "prueba";
  document.getElementById("divShowDetails").style.display = "block";
}

function displayRepairs(repairs) {
  const status = document.getElementById("filterStatus").value;
  const header = `
                <h3>Reparaciones Registradas</h3>
                <label for="filterStatus">Filtrar por estado</label>
                <select id="filterStatus" onchange="filterRepairs()">
                    <option value="Todo">${status}</option>
                    <option value="Reparado">Reparado</option>
                    <option value="Entregado">Entregado</option>
                    <option value="No Reparado">No Reparado</option>
                    <option value="Revisando">Revisando</option>
                    <option value="Pendiente Repuesto">Pendiente Repuesto</option>
                </select>
                <br><label for="searchQuery">Buscar x Nombre o teléfono</label>
                <input type="text" id="searchQuery" onChange="searchRepairs()">
            `;
  const table = `<table class='repair-item'>
              <tr>
                <th>Nombre  </th> <th> Telefono </th> <th> Referencia </th> <th> Detalle </th><th> Estado </th><th>Precio </th><th> Deposito </th><th> Fecha Ingreso </th><th> Fecha Reparacion </th><th> Fecha Entrega </th><th>Editar</th></tr>  
              ${repairs.map((repair) => {
                return `<tr>
                    <td>${repair.name}</td>
                    <td>${repair.phone}</td>
                    <td>${repair.reference} </td> 
                    <td onclick="showDetails('${repair.details}')">${
                  repair.details
                }</td>
                    <td>${repair.status}</td>
                    <td>${formatNumber(repair.price)}</td>
                    <td>${formatNumber(repair.deposit)} </td>
                    <td>${formatDate(repair.entry_date)}</td>
                    <td>${formatDate(repair.repair_date)}</td> 
                    <td>${formatDate(repair.delivery_date)}</td>
                    <td><button class="update-status" onclick="showEditForm(${
                      repair.id
                    }, '${repair.name}', '${repair.phone}', '${
                  repair.reference
                }', '${repair.details}', ${repair.price}, ${repair.deposit}, '${
                  repair.status
                }', '${formatDate(repair.entry_date)}', '${formatDate(
                  repair.repair_date
                )}', '${
                  formatDate(repair.delivery_date) || ""
                }')">Edit</button></td>
                </tr>`;
              })}
            </table>`;

  repairList.innerHTML = header + table;
}

async function updateStatus(id, status) {
  try {
    const response = await fetch(`http://localhost:3000/update-status/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (response.ok) {
      alert("Estado actualizado exitosamente");
      filterRepairs();
    } else {
      alert("Error al actualizar el estado");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error en la solicitud");
  }
}

function showEditForm(
  id,
  name,
  phone,
  reference,
  details,
  price,
  deposit,
  status,
  entryDate,
  repairDate
) {
  document.getElementById("editId").value = id;
  document.getElementById("editName").value = name;
  document.getElementById("editPhone").value = phone;
  document.getElementById("editReference").value = reference;
  document.getElementById("editDetails").value = details;
  document.getElementById("editPrice").value = price;
  document.getElementById("editDeposit").value = deposit;
  document.getElementById("editStatus").value = status;
  document.getElementById("editEntryDate").value = entryDate;
  document.getElementById("editRepairDate").value = repairDate;
  document.getElementById("editContainer").style.display = "block";
}

function hideEditForm() {
  document.getElementById("editContainer").style.display = "none";
}
function hideDetails() {
  document.getElementById("divShowDetails").style.display = "none";
}

// Cargar todas las reparaciones al cargar la página
loadRepairs();
