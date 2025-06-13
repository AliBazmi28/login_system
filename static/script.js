function Login(){
    const id = document.querySelector('input[placeholder="Enter your ID"]').value;
    const password = document.querySelector('input[placeholder="Enter your password"]').value;


    fetch("https://loginsystem-production-aa2b.up.railway.app/login", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({id,password}),
})
    .then((res)=> {
        if (!res.ok){
            throw new Error("Network response was not ok");
            
        }
        return res.json();
    })

    .then((data)=>{
        if(data.success){
            window.location.href = "/home.html";
        }else {
            alert("Invalid ID or password.");
        }
})
    .catch((error)=> {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
    });
}