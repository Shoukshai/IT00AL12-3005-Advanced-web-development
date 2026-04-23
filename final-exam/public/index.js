function $(id) {
    return document.getElementById(id);
}

let selectedId = null;

let firstNameEl;
let lastNameEl;
let emailEl;
let phonePrefixEl;
let phoneEl;
let birthDateEl;
let addBtn;
let updateBtn;
let deleteBtn;
let clearBtn;
let statusEl;
let modalOverlay;
let modalCancel;
let modalConfirm;

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function validateEmail() {
    const value = emailEl.value.trim();

    if (value === '') {
        emailEl.classList.remove('input-valid', 'input-invalid');
        return;
    }

    if (isValidEmail(value)) {
        emailEl.classList.add('input-valid');
        emailEl.classList.remove('input-invalid');
        return;
    }

    emailEl.classList.add('input-invalid');
    emailEl.classList.remove('input-valid');
}

function enforceNumericPhone() {
    phoneEl.value = phoneEl.value.replace(/[^\d\s]/g, '');
}

function showDeleteModal() {
    return new Promise((resolve) => {
        modalOverlay.style.display = 'flex';
        requestAnimationFrame(() => {
            modalOverlay.classList.add('modal-visible');
        });

        function cleanup(result) {
            modalOverlay.classList.remove('modal-visible');
            setTimeout(() => {
                modalOverlay.style.display = 'none';
            }, 200);
            modalConfirm.removeEventListener('click', onConfirm);
            modalCancel.removeEventListener('click', onCancel);
            modalOverlay.removeEventListener('click', onBackdrop);
            resolve(result);
        }

        function onConfirm() {
            cleanup(true);
        }

        function onCancel() {
            cleanup(false);
        }

        function onBackdrop(event) {
            if (event.target === modalOverlay) {
                cleanup(false);
            }
        }

        modalConfirm.addEventListener('click', onConfirm);
        modalCancel.addEventListener('click', onCancel);
        modalOverlay.addEventListener('click', onBackdrop);
    });
}

function setStatus(message, isError = false) {
    statusEl.textContent = message;
    statusEl.className = `form-status ${isError ? 'error' : 'success'}`;
    statusEl.style.display = 'block';

    setTimeout(() => {
        statusEl.style.display = 'none';
    }, 4000);
}

function clearForm() {
    selectedId = null;
    firstNameEl.value = '';
    lastNameEl.value = '';
    emailEl.value = '';
    emailEl.classList.remove('input-valid', 'input-invalid');
    phonePrefixEl.value = '+33';
    phoneEl.value = '';
    birthDateEl.value = '';
    updateBtn.disabled = true;
    deleteBtn.disabled = true;

    document.querySelectorAll('.customer-card').forEach((card) => {
        card.classList.remove('selected');
    });
}

function getFullPhone() {
    const number = phoneEl.value.trim();

    if (!number) {
        return '';
    }

    const dialCode = phonePrefixEl.value.split('-')[0];
    return `${dialCode} ${number}`;
}

function splitPhone(fullPhone) {
    if (!fullPhone) {
        return {
            prefix: '+33',
            number: ''
        };
    }

    const match = fullPhone.match(/^(\+\d+)\s*(.*)/);

    if (!match) {
        return {
            prefix: '+33',
            number: fullPhone
        };
    }

    const dialCode = match[1];
    const number = match[2];
    const option = Array.from(phonePrefixEl.options).find((entry) => entry.value.startsWith(dialCode));

    return {
        prefix: option ? option.value : '+33',
        number: number
    };
}

function populateForm(person) {
    selectedId = person.id;
    firstNameEl.value = person.first_name || '';
    lastNameEl.value = person.last_name || '';
    emailEl.value = person.email || '';
    validateEmail();

    const { prefix, number } = splitPhone(person.phone || '');
    const option = phonePrefixEl.querySelector(`option[value="${prefix}"]`);
    phonePrefixEl.value = option ? prefix : '+33';
    phoneEl.value = number;
    birthDateEl.value = person.birth_date ? person.birth_date.substring(0, 10) : '';
    updateBtn.disabled = false;
    deleteBtn.disabled = false;
}

async function loadCustomers() {
    const container = $('customer-list');

    try {
        const response = await fetch('/api/persons');

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        container.innerHTML = '';

        if (data.length === 0) {
            container.innerHTML = "<p class='empty-state'>No customers found.</p>";
            return;
        }

        data.forEach((person, index) => {
            const card = document.createElement('div');
            card.className = 'customer-card';
            card.style.animationDelay = `${index * 0.05}s`;

            if (person.id === selectedId) {
                card.classList.add('selected');
            }

            card.innerHTML = `
                <div class="card-name">${person.first_name} ${person.last_name}</div>
                <div class="card-detail"><span class="card-label">Email</span>${person.email}</div>
                <div class="card-detail"><span class="card-label">Phone</span>${person.phone || '-'}</div>
            `;

            card.addEventListener('click', () => {
                document.querySelectorAll('.customer-card').forEach((entry) => {
                    entry.classList.remove('selected');
                });
                card.classList.add('selected');
                populateForm(person);
            });

            container.appendChild(card);
        });
    } catch (error) {
        console.error(error);
        container.innerHTML = "<p style='color:red;'>Error loading data</p>";
    }
}

async function addCustomer() {
    const body = {
        first_name: firstNameEl.value.trim(),
        last_name: lastNameEl.value.trim(),
        email: emailEl.value.trim(),
        phone: getFullPhone(),
        birth_date: birthDateEl.value || null
    };

    if (!body.first_name || !body.last_name || !body.email) {
        setStatus('First name, last name, and email are required.', true);
        return;
    }

    if (!isValidEmail(body.email)) {
        setStatus('Please enter a valid email address.', true);
        emailEl.classList.add('input-invalid');
        emailEl.classList.remove('input-valid');
        return;
    }

    try {
        const response = await fetch('/api/persons', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();

        if (!response.ok) {
            setStatus(data.error || 'Failed to create customer.', true);
            return;
        }

        setStatus('Customer added successfully.');
        clearForm();
        loadCustomers();
    } catch (error) {
        setStatus('Network error.', true);
    }
}

async function updateCustomer() {
    if (!selectedId) {
        return;
    }

    const body = {
        first_name: firstNameEl.value.trim(),
        last_name: lastNameEl.value.trim(),
        email: emailEl.value.trim(),
        phone: getFullPhone(),
        birth_date: birthDateEl.value || null
    };

    if (!body.first_name || !body.last_name || !body.email) {
        setStatus('First name, last name, and email are required.', true);
        return;
    }

    if (!isValidEmail(body.email)) {
        setStatus('Please enter a valid email address.', true);
        emailEl.classList.add('input-invalid');
        emailEl.classList.remove('input-valid');
        return;
    }

    try {
        const response = await fetch(`/api/persons/${selectedId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();

        if (!response.ok) {
            setStatus(data.error || 'Failed to update customer.', true);
            return;
        }

        setStatus('Customer updated successfully.');
        clearForm();
        loadCustomers();
    } catch (error) {
        setStatus('Network error.', true);
    }
}

async function deleteCustomer() {
    if (!selectedId) {
        return;
    }

    const confirmed = await showDeleteModal();

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`/api/persons/${selectedId}`, {
            method: 'DELETE'
        });
        const data = await response.json();

        if (!response.ok) {
            setStatus(data.error || 'Failed to delete customer.', true);
            return;
        }

        setStatus('Customer deleted.');
        clearForm();
        loadCustomers();
    } catch (error) {
        setStatus('Network error.', true);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    firstNameEl = $('first-name');
    lastNameEl = $('last-name');
    emailEl = $('email');
    phonePrefixEl = $('phone-prefix');
    phoneEl = $('phone');
    birthDateEl = $('birth-date');
    addBtn = $('btn-add');
    updateBtn = $('btn-update');
    deleteBtn = $('btn-delete');
    clearBtn = $('btn-clear');
    statusEl = $('form-status');
    modalOverlay = $('delete-modal');
    modalCancel = $('modal-cancel');
    modalConfirm = $('modal-confirm');

    emailEl.addEventListener('input', validateEmail);
    phoneEl.addEventListener('input', enforceNumericPhone);

    addBtn.addEventListener('click', addCustomer);
    updateBtn.addEventListener('click', updateCustomer);
    deleteBtn.addEventListener('click', deleteCustomer);
    clearBtn.addEventListener('click', clearForm);

    updateBtn.disabled = true;
    deleteBtn.disabled = true;

    loadCustomers();
});
