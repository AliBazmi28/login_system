
document.addEventListener("DOMContentLoaded", function () {
    // Auto-fill user_id from URL param
    const urlParams = new URLSearchParams(window.location.search);
    const userIdFromUrl = urlParams.get("id");
    if (userIdFromUrl) {
        document.querySelector("[name='user_id']").value = userIdFromUrl;
    }

    const form = document.querySelector("form");
    const gpaInput = document.querySelector("input[name='gpa']");
    const percentageBox = document.getElementById("percentage");

    gpaInput.addEventListener("input", () => {
        const gpa = parseFloat(gpaInput.value);
        if (!isNaN(gpa)) {
            const percentage = (gpa * 20).toFixed(2);
            percentageBox.value = percentage;
        } else {
            percentageBox.value = "";
        }
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const user_id = document.querySelector("[name='user_id']").value.trim();
        const first_name = document.querySelector("[name='first_name']").value.trim();
        const middle_name = document.querySelector("[name='middle_name']").value.trim();
        const last_name = document.querySelector("[name='last_name']").value.trim();
        const enrollment = document.querySelector("[name='enrollment']").value.trim();
        const cnic = document.querySelector("[name='cnic']").value.trim();
        const phone = document.querySelector("[name='phone']").value.trim();
        const dob = document.querySelector("[name='dob']").value.trim();
        const course = document.querySelector("[name='course']").value.trim();
        const semester = document.querySelector("[name='semester']").value.trim();
        const address = document.querySelector("[name='address']").value.trim();
        const gpa = document.querySelector("[name='gpa']").value.trim();

        let percentage = 0;
        if (!isNaN(gpa) && gpa !== "") {
            percentage = parseFloat(gpa) * 20;
        }

        if (
            !user_id || !first_name || !last_name || !enrollment ||
            !cnic || !phone || !dob || !address || !gpa ||
            course === "" || semester === ""
        ) {
            alert("Please fill in all required fields.");
            return;
        }

        fetch("/submit-application", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id,
                first_name,
                middle_name,
                last_name,
                enrollment,
                cnic,
                phone,
                dob,
                course,
                semester,
                address,
                gpa,
                percentage
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Application submitted successfully!");
                form.reset();
                percentageBox.value = "";
            } else {
                alert("Submission failed: " + (data.error || "Unknown error"));
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        });
    });
});
