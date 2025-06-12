function Login(){
    const id = document.querySelector('input[placeholder="Enter your ID"]').value;
    const password = document.querySelector('input[placeholder="Enter your password"]').value;


    fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({id,password}),
})
    .then((res)=> res.json())
    .then((data)=>{
        if(data.success){
            window.location.href = "home.html";
        }else {
            alert("Invalid ID or password.");
        }
})
    .catch((error)=> console.error("Error:", error));
}