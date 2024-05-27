
        document.addEventListener('click', function(event) {
            var popup = document.getElementById('popup');
            popup.style.left = event.pageX + 'px';
            popup.style.top = event.pageY + 'px';
            popup.style.display = 'block';
        });

        document.getElementById('repairForm').addEventListener('submit', async function(e) {
            e.preventDefault();

            const data = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                reference: document.getElementById('reference').value,
                details: document.getElementById('details').value,
                price: document.getElementById('price').value,
                deposit: document.getElementById('deposit').value,
                status: document.getElementById('status').value,
                entryDate: document.getElementById('entryDate').value,
                deliveryDate: document.getElementById('deliveryDate').value
            };
            try {
                const response = await fetch('http://localhost:3000/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('Registro exitoso');
                    document.getElementById('repairForm').reset();
                    loadRepairs();
                } else {
                    alert('Error en el registro');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error en la solicitud');
            }
        });

        document.getElementById('editForm').addEventListener('submit', async function(e) {
            e.preventDefault();

            const data = {
                name: document.getElementById('editName').value,
                phone: document.getElementById('editPhone').value,
                reference: document.getElementById('editReference').value,
                details: document.getElementById('editDetails').value,
                price: document.getElementById('editPrice').value,
                deposit: document.getElementById('editDeposit').value,
                status: document.getElementById('editStatus').value,
                entryDate: document.getElementById('editEntryDate').value,
                deliveryDate: document.getElementById('editDeliveryDate').value
            };

            const id = document.getElementById('editId').value;

            try {
                const response = await fetch(`http://localhost:3000/repairs/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('Reparación actualizada exitosamente');
                    document.getElementById('editForm').reset();
                    hideEditForm();
                    loadRepairs();
                } else {
                    alert('Error al actualizar la reparación');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error en la solicitud');
            }
        });

        async function loadRepairs() {
            try {
                const response = await fetch('http://localhost:3000/repairs');
                const repairs = await response.json();
                displayRepairs(repairs);
            } catch (error) {
                console.error('Error:', error);
                alert('Error al obtener los datos');
            }
        }

        async function filterRepairs() {
            const status = document.getElementById('filterStatus').value;
            const url = status ? `http://localhost:3000/repairs/status/${status}` : 'http://localhost:3000/repairs';

            try {
                const response = await fetch(url);
                const repairs = await response.json();
                displayRepairs(repairs);
            } catch (error) {
                console.error('Error:', error);
                alert('Error al filtrar los datos');
            }
        }

        async function searchRepairs() {
            const query = document.getElementById('searchQuery').value;
            console.log("en funcion searchRepairs()");
            if (query.length < 3) {
                loadRepairs();
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/repairs/search?query=${query}`);
                const repairs = await response.json();
                displayRepairs(repairs);
            } catch (error) {
                console.error('Error:', error);
                alert('Error al buscar las reparaciones');
            }
        }

        function displayRepairs(repairs) {
            const repairList = document.getElementById('repairList');
            repairList.innerHTML = `
                <h3>Reparaciones Registradas</h3>
                <label for="filterStatus">Filtrar por estado</label>
                <select id="filterStatus" onchange="filterRepairs()">
                    <option value="*">Todos</option>
                    <option value="Completado">Completado</option>
                    <option value="No Reparado">No Reparado</option>
                    <option value="Revisando">Revisando</option>
                    <option value="Pendiente Repuesto">Pendiente Repuesto</option>
                </select>
                <br><label for="searchQuery">Buscar x Nombre o teléfono</label>
                <input type="text" id="searchQuery" onChange="searchRepairs()">
                <input type="submit" id="searchQuery" onClick="searchRepairs()">
            `;

            repairs.forEach(repair => {
                const repairItem = document.createElement('div');
                repairItem.className = 'repair-item';
                repairItem.innerHTML = `
                    <p><strong>${repair.name}</strong></p>
                    <li><strong>Teléfono:</strong> ${repair.phone}</li>
                    <li><strong>Referencia:</strong> ${repair.reference}</li>
                    <li><strong>Detalles:</strong> ${repair.details}</li>
                    <li><strong>Precio:</strong> ${repair.price}</li>
                    <li><strong>Abono:</strong> ${repair.deposit}</li>
                    <li><strong>Estado:</strong> ${repair.status}</li>
                    <li><strong>Fecha de Ingreso:</strong> ${repair.entry_date}</li>
                    <li><strong>Fecha de Entrega:</strong> ${repair.delivery_date || 'N/A'}</li>
                    <button class="update-status status-pending" onclick="updateStatus(${repair.id}, 'Pendiente Repuesto')">Pendiente Repuesto</button>
                    <button class="update-status status-in-process" onclick="updateStatus(${repair.id}, 'Revisando')">Revisando</button>
                    <button class="update-status status-no-reparado" onclick="updateStatus(${repair.id}, 'No Reparado')">No Reparado</button>
                    <button class="update-status status-reparado" onclick="updateStatus(${repair.id}, 'Completado')">Completado</button>
                    <button class="update-status" onclick="showEditForm(${repair.id}, '${repair.name}', '${repair.phone}', '${repair.reference}', '${repair.details}', ${repair.price}, ${repair.deposit}, '${repair.status}', '${repair.entry_date}', '${repair.delivery_date || ''}')">Editar</button>
                `;
                repairList.appendChild(repairItem);
            });
        }

        async function updateStatus(id, status) {
            try {
                const response = await fetch(`http://localhost:3000/update-status/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status })
                });

                if (response.ok) {
                    alert('Estado actualizado exitosamente');
                    filterRepairs();
                } else {
                    alert('Error al actualizar el estado');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error en la solicitud');
            }
        }

        function showEditForm(id, name, phone, reference, details, price, deposit, status, entryDate, deliveryDate) {
            document.getElementById('editId').value = id;
            document.getElementById('editName').value = name;
            document.getElementById('editPhone').value = phone;
            document.getElementById('editReference').value = reference;
            document.getElementById('editDetails').value = details;
            document.getElementById('editPrice').value = price;
            document.getElementById('editDeposit').value = deposit;
            document.getElementById('editStatus').value = status;
            document.getElementById('editEntryDate').value = entryDate;
            document.getElementById('editDeliveryDate').value = deliveryDate;
            document.getElementById('editContainer').style.display = 'block';
            document.getElementById('containerEditForm').style.display='block';

        }

        function hideEditForm() {
            document.getElementById('editContainer').style.display = 'none';
            document.getElementById('containerEditForm').style.display = 'none';
        }

        // Cargar todas las reparaciones al cargar la página
        loadRepairs();