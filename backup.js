//  repairs.forEach(repair => {
//     const repairItem = document.createElement('div');
//     repairItem.className = 'repair-item';
//     repairItem.innerHTML = `
//         <p><strong>${repair.name}</strong></p>
//         <li><strong>Teléfono:</strong> ${repair.phone}</li>
//         <li><strong>Referencia:</strong> ${repair.reference}</li>
//         <li><strong>Detalles:</strong> ${repair.details}</li>
//         <li><strong>Precio:</strong> ${formatNumber(repair.price)}</li>
//         <li><strong>Abono:</strong> ${formatNumber(repair.deposit)}</li>
//         <li><strong>Estado:</strong> ${repair.status}</li>
//         <li><strong>Fecha de Ingreso:</strong>${formatDate(repair.entry_date)}</li>
//         <li><strong>Fecha de Entrega:</strong> ${formatDate(repair.delivery_date) || 'N/A'}</li>
//         <button class="update-status status-pending" onclick="updateStatus(${repair.id}, 'Pendiente Repuesto')">Pendiente Repuesto</button>
//         <button class="update-status status-in-process" onclick="updateStatus(${repair.id}, 'Revisando')">Revisando</button>
//         <button class="update-status status-no-reparado" onclick="updateStatus(${repair.id}, 'No Reparado')">No Reparado</button>
//         <button class="update-status status-reparado" onclick="updateStatus(${repair.id}, 'Completado')">Completado</button>
//         <button class="update-status" onclick="showEditForm(${repair.id}, '${repair.name}', '${repair.phone}', '${repair.reference}', '${repair.details}', ${repair.price}, ${repair.deposit}, '${repair.status}', '${formatDate(repair.entry_date)}', '${formatDate(repair.delivery_date || '')}')">Editarrrr</button>
//     `;
//     repairList.appendChild(repairItem);
// });
