function $(id) {
  return document.getElementById(id);
}

function logSection(title, data) {
  console.group(title);
  console.log(data);
  console.groupEnd();
}

document.addEventListener("DOMContentLoaded", () => {
  const form = $("resourceForm");
  if (!form) {
    console.warn("resourceForm not found. Ensure the form has id=\"resourceForm\".");
    return;
  }

  form.addEventListener("submit", onSubmit);
});

async function onSubmit(event) {
  event.preventDefault();
  const submitter = event.submitter;
  const actionValue = submitter && submitter.value ? submitter.value : "create";
  
  const resourceNameRaw = $("resourceName")?.value ?? "";
  const resourceDescriptionRaw = $("resourceDescription")?.value ?? "";
  const resourceAvailableChecked = $("resourceAvailable")?.checked ?? false;
  const resourcePriceRaw = $("resourcePrice")?.value ?? "";
  const resourcePriceUnitElements = document.getElementsByName("resourcePriceUnit");
  let resourcePriceUnit = "";
  for (const el of resourcePriceUnitElements) {
    if (el.checked) {
      resourcePriceUnit = el.value;
      break;
    }
  }

  const resourceName = resourceNameRaw.trim();
  const resourceDescription = resourceDescriptionRaw.trim();
  const resourcePrice = resourcePriceRaw.trim();

  const payload = {
    action: actionValue,
    resourceName: resourceName,
    resourceDescription: resourceDescription,
    resourceAvailable: resourceAvailableChecked,
    resourcePrice: resourcePrice,
    resourcePriceUnit: resourcePriceUnit
  };

  logSection("Sending payload to httpbin.org/post", payload);

  try {
    const response = await fetch("https://httpbin.org/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`HTTP ${response.status} ${response.statusText}\n${text}`);
    }

    const data = await response.json();

    console.group("Response from httpbin.org");
    console.log("Status:", response.status);
    console.log("URL:", data.url);
    console.log("You sent (echo):", data.json);
    console.log("Headers (echoed):", data.headers);
    console.groupEnd();

  } catch (err) {
    console.error("POST error:", err);
  }
}
