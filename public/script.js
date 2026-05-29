function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");

    setTimeout(() => toast.classList.remove("show"), 2000);
}

function showPopup(link) {
    const popup = document.getElementById("customPopup");
    const shortLink = document.getElementById("shortLink");

    shortLink.textContent = link;
    shortLink.href = link;

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
    const btnText = document.getElementById("btnText");

    btn.classList.add("loading");
    spinner.style.display = "inline-block";
    btnText.textContent = "Shortening...";

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

    btn.classList.remove("loading");
    spinner.style.display = "none";
    btnText.textContent = "Shorten";
});

function copyToClipboard() {
    const link = document.getElementById("shortLink").href;
    const btn = document.getElementById("copyButton");

    navigator.clipboard.writeText(link).then(() => {
        btn.classList.add("copy-success");
        showToast("Copied!");

        setTimeout(() => btn.classList.remove("copy-success"), 300);
    });
}
