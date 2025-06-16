function Login() {
    const id = document.getElementById("userID").value.trim();
    const password = document.getElementById("userPassword").value.trim();

    if (!id || !password) {
        alert("Please fill in all the fields");
        return;
    }

    console.log("ID:", id);
    console.log("Password:", password);

    const baseURL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://127.0.0.1:5000"
        : "https://loginsystem-production-aa2b.up.railway.app";

    fetch(`${baseURL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id, password }),
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();
        })
        .then((data) => {
            if (data.success) {
                window.location.href = "/apply?id=" + encodeURIComponent(id);
            } else {
                alert("Invalid ID or password.");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
        });
}
