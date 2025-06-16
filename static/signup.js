document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const firstName = form.querySelector("[name='first_name']");
    const lastName = form.querySelector("[name='last_name']");
    const email = form.querySelector("[name='email']");
    const password = form.querySelector("[name='password']");
    const confirmPassword = form.querySelector("[name='confirm_password']");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        if (
            !firstName.value.trim() ||
            !lastName.value.trim() ||
            !email.value.trim() ||
            !password.value ||
            !confirmPassword.value
        ) {
            alert("Please fill in all fields.");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value)) {
            alert("Please enter a valid email address");
            return;
        }

        if (password.value !== confirmPassword.value) {
            alert("Passwords do not match.");
            return;
        }

        fetch("/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstName: firstName.value,
                lastName: lastName.value,
                email: email.value,
                password: password.value
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Signup Successful. Redirecting to login")
                window.location.href = data.redirect;
            } else {
                alert("Signup failed: " + (data.error || "Unknown error"));
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
        });
    });
});
