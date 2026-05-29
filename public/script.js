function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

function showPopup(link) {
    const popup = document.getElementById("customPopup");
    const shortLink = document.getElementById("shortLink");
    const qr = document.getElementById("qrCode");

    shortLink.textContent = link;
    shortLink.href = link;

    qr.src = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(link)}`;

    popup.style.display = "flex";
}

function closePopup() {
    document.getElementById("customPopup").style.display = "none";
}

document.getElementById("shortenForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const input = document.getElementById("longURL");
    const btn = document.getElementById("submitBtn");
    const spinner = document.getElementById("spinner");
    const text = document.getElementById("btnText");

    btn.disabled = true;
    spinner.style.display = "inline-block";
    text.textContent = "Shortening...";

    try {
        const res = await fetch("/api/shorten", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: input.value })
        });

        const data = await res.json();

        if (!data.hash) {
            showToast(data.error || "Error");
            return;
        }

        const link = `${window.location.origin}/${data.hash}`;

        showPopup(link);
        showToast("Link created!");
        input.value = "";

    } catch {
        showToast("Network error");
    }

    btn.disabled = false;
    spinner.style.display = "none";
    text.textContent = "Shorten";
});

function copyToClipboard() {
    const link = document.getElementById("shortLink").href;
    navigator.clipboard.writeText(link).then(() => showToast("Copied!"));
}
