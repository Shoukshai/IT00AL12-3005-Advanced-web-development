const actions = document.getElementById("resourceActions");
const resourceNameContainer = document.getElementById("resourceNameContainer");

const role = "admin";

let createButton = null;
let updateButton = null;
let deleteButton = null;

const BUTTON_BASE_CLASSES =
  "w-full rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-200 ease-out";

const BUTTON_ENABLED_CLASSES =
  "bg-brand-primary text-white hover:bg-brand-dark/80 shadow-soft";

const BUTTON_DISABLED_CLASSES =
  "cursor-not-allowed opacity-50";

function addButton({ label, type = "button", value, classes = "" }) {
  const btn = document.createElement("button");
  btn.type = type;
  btn.textContent = label;
  btn.name = "action";
  if (value) btn.value = value;

  btn.className = `${BUTTON_BASE_CLASSES} ${classes}`.trim();

  actions.appendChild(btn);
  return btn;
}

function setButtonEnabled(btn, enabled) {
  if (!btn) return;

  btn.disabled = !enabled;

  btn.classList.toggle("cursor-not-allowed", !enabled);
  btn.classList.toggle("opacity-50", !enabled);

  if (!enabled) {
    btn.classList.remove("hover:bg-brand-dark/80");
  } else {
    if (btn.value === "create" || btn.textContent === "Create") {
      btn.classList.add("hover:bg-brand-dark/80");
    }
  }
}

function renderActionButtons(currentRole) {
  if (currentRole === "reserver") {
    createButton = addButton({
      label: "Create",
      type: "submit",
      classes: BUTTON_ENABLED_CLASSES,
    });
  }

  if (currentRole === "admin") {
    createButton = addButton({
      label: "Create",
      type: "submit",
      value: "create",
      classes: BUTTON_ENABLED_CLASSES,
    });

    updateButton = addButton({
      label: "Update",
      value: "update",
      classes: BUTTON_ENABLED_CLASSES,
    });

    deleteButton = addButton({
      label: "Delete",
      value: "delete",
      classes: BUTTON_ENABLED_CLASSES,
    });
  }

  setButtonEnabled(createButton, false);
  setButtonEnabled(updateButton, false);
  setButtonEnabled(deleteButton, false);
}

function createResourceNameInput(container) {
  const input = document.createElement("input");

  input.id = "resourceName";
  input.name = "resourceName";
  input.type = "text";
  input.placeholder = "e.g., Meeting Room A";

  input.className = `
    mt-2 w-full rounded-2xl border border-black/10 bg-white
    px-4 py-3 text-sm outline-none
    focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30
    transition-all duration-200 ease-out
  `;

  container.appendChild(input);
  return input;
}

function isResourceNameValid(value) {
  const trimmed = value.trim();

  const allowedPattern = /^[a-zA-Z0-9äöåÄÖÅ ]+$/;

  const lengthValid = trimmed.length >= 5 && trimmed.length <= 30;
  const charactersValid = allowedPattern.test(trimmed);

  return lengthValid && charactersValid;
}

function isResourceDescriptionValid(value) {
  const trimmed = value.trim();

  const allowedPattern = /^[a-zA-Z0-9äöåÄÖÅ ]+$/;

  const lengthValid = trimmed.length >= 10 && trimmed.length <= 50;
  const charactersValid = allowedPattern.test(trimmed);

  return lengthValid && charactersValid;
}

function isResourcePriceValid(value) {
  const trimmed = value.trim();
  
  if (trimmed === "") return false;
  
  const num = parseFloat(trimmed);
  
  return !isNaN(num) && num >= 0 && /^[0-9]*\.?[0-9]*$/.test(trimmed);
}

function setInputVisualState(input, state) {
  input.classList.remove(
    "border-green-500",
    "bg-green-50",
    "focus:ring-green-500/30",
    "border-red-500",
    "bg-red-50",
    "focus:ring-red-500/30",
    "focus:border-brand-blue",
    "focus:ring-brand-blue/30"
  );

  input.classList.add("focus:ring-2");

  if (state === "valid") {
    input.classList.add("border-green-500", "bg-green-50", "focus:ring-green-500/30");
  } else if (state === "invalid") {
    input.classList.add("border-red-500", "bg-red-50", "focus:ring-red-500/30");
  }
}

const validationState = {
  resourceName: false,
  resourceDescription: false,
  resourcePrice: false
};

function updateCreateButtonState() {
  const allValid = validationState.resourceName && 
                   validationState.resourceDescription && 
                   validationState.resourcePrice;
  setButtonEnabled(createButton, allValid);
}

function attachResourceNameValidation(input) {
  const update = () => {
    const raw = input.value;
    if (raw.trim() === "") {
      setInputVisualState(input, "neutral");
      validationState.resourceName = false;
      updateCreateButtonState();
      return;
    }

    const valid = isResourceNameValid(raw);

    setInputVisualState(input, valid ? "valid" : "invalid");
    validationState.resourceName = valid;
    updateCreateButtonState();
  };

  input.addEventListener("input", update);

  update();
}

function attachResourceDescriptionValidation(input) {
  const update = () => {
    const raw = input.value;
    if (raw.trim() === "") {
      setInputVisualState(input, "neutral");
      validationState.resourceDescription = false;
      updateCreateButtonState();
      return;
    }

    const valid = isResourceDescriptionValid(raw);

    setInputVisualState(input, valid ? "valid" : "invalid");
    validationState.resourceDescription = valid;
    updateCreateButtonState();
  };

  input.addEventListener("input", update);

  update();
}

function attachResourcePriceValidation(input) {
  const update = () => {
    const raw = input.value;
    if (raw.trim() === "") {
      setInputVisualState(input, "neutral");
      validationState.resourcePrice = false;
      updateCreateButtonState();
      return;
    }

    const valid = isResourcePriceValid(raw);

    setInputVisualState(input, valid ? "valid" : "invalid");
    validationState.resourcePrice = valid;
    updateCreateButtonState();
  };

  input.addEventListener("input", update);

  update();
}

renderActionButtons(role);

const resourceNameInput = createResourceNameInput(resourceNameContainer);
attachResourceNameValidation(resourceNameInput);

const resourceDescriptionInput = document.getElementById("resourceDescription");
if (resourceDescriptionInput) {
  attachResourceDescriptionValidation(resourceDescriptionInput);
}

const resourcePriceInput = document.getElementById("resourcePrice");
if (resourcePriceInput) {
  attachResourcePriceValidation(resourcePriceInput);
}
