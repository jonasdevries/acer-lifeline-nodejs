// public/script.js
document.getElementById('register-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const internalRef = document.getElementById('internalRef').value;
  const serialNumber = document.getElementById('serialNumber').value;
  const description = document.getElementById('description').value;
  const createdBy = parseInt(document.getElementById('createdBy').value, 10);
  const statusId = parseInt(document.getElementById('statusId').value, 10);

  const response = await fetch('/repairs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ internalRef, serialNumber, description, createdBy, statusId })
  });

  if (response.ok) {
    alert('Device registered successfully');
    loadDevices();
  } else {
    alert('Error registering device');
  }
});

async function loadDevices() {
  const response = await fetch('/repairs');
  const devices = await response.json();
  const deviceList = document.getElementById('device-list');
  deviceList.innerHTML = '';
  devices.forEach(device => {
    const li = document.createElement('li');
    li.textContent = `${device.internal_ref} - ${device.serial_number} - ${device.description}`;
    deviceList.appendChild(li);
  });
}

loadDevices();
