document.addEventListener("DOMContentLoaded", function () {
    // ✅ Initialize flatpickr for DOB field
    flatpickr("#dob", {
        dateFormat: "Y-m-d",
        allowInput: true,
        maxDate: "today",
        defaultDate: null
    });

    // ✅ Auto-fill user_id from URL
    const urlParams = new URLSearchParams(window.location.search);
    const userIdFromUrl = urlParams.get("id");
    if (userIdFromUrl) {
        document.querySelector("[name='user_id']").value = userIdFromUrl;
    }

    // ✅ Format CNICs
    ["father_cnic", "cnic"].forEach(function (id) {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener("input", function (e) {
                let value = e.target.value.replace(/\D/g, "");
                if (value.length > 13) value = value.slice(0, 13);
                let formatted = value;
                if (value.length > 5) formatted = value.slice(0, 5) + "-" + value.slice(5);
                if (value.length > 12) formatted = formatted.slice(0, 13) + "-" + value.slice(12);
                e.target.value = formatted;
            });
        }
    });

// ✅ Format Phone Numbers
    ["father_phone", "student_phone"].forEach(function (id) {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener("input", function (e) {
                let value = e.target.value.replace(/\D/g, "");
                if (value.length > 11) value = value.slice(0, 11);
                let formatted = value;
                if (value.length > 4) formatted = value.slice(0, 4) + "-" + value.slice(4);
                e.target.value = formatted;
            });
        }
    });


    // ✅ Convert percentage ➜ GPA
    const form = document.querySelector("form");
    const gpaInput = document.querySelector("input[name='gpa']");
    const percentageInput = document.getElementById("percentage");

    percentageInput.addEventListener("input", () => {
        const perc = parseFloat(percentageInput.value);
        if (!isNaN(perc) && perc >= 0 && perc <= 100) {
            const gpa = (perc / 25).toFixed(2); // Updated conversion logic
            gpaInput.value = gpa;
        } else {
            gpaInput.value = "";
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
        const phone = document.querySelector("[name='student_phone']").value.trim();
        const dob = document.querySelector("[name='dob']").value.trim();
        const course = document.querySelector("[name='course']").value.trim();
        const semester = document.querySelector("[name='semester']").value.trim();
        const gpa = document.querySelector("[name='gpa']").value.trim();
        const father_name = document.querySelector("[name='father_name']").value.trim();
        const father_cnic = document.querySelector("[name='father_cnic']").value.trim();
        const father_phone = document.querySelector("[name='father_phone']").value.trim();
        const monthly_income = document.querySelector("[name='monthly_income']").value.trim();
        const father_occupation = document.querySelector("[name='father_occupation']").value.trim();    
        const percentage = parseFloat(percentageInput.value.trim());

        if (
            !user_id || !first_name || !last_name || !enrollment ||
            !cnic || !phone || !dob || !gpa || !monthly_income ||
            !father_name || !father_cnic || !father_phone ||!father_occupation ||
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
                father_name,
                father_cnic,
                father_phone,
                father_occupation,
                monthly_income,
                enrollment,
                cnic,
                phone,
                dob,
                course,
                semester,
                gpa,
                percentage
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Application submitted successfully!");
                form.reset();
                percentageInput.value = "";
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
