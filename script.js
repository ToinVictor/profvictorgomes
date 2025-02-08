document.getElementById("toggleMateriais").addEventListener("click", function() {
    let materiais = document.getElementById("materiais");
    
    if (materiais.classList.contains("d-none")) {
        materiais.classList.remove("d-none");
        materiais.classList.add("fade-in");
    } else {
        materiais.classList.add("fade-out");
        setTimeout(() => {
            materiais.classList.add("d-none");
            materiais.classList.remove("fade-out");
        }, 500);
    }
});

document.querySelectorAll(".btn-mostrar").forEach(button => {
    button.addEventListener("click", function() {
        let targetId = this.getAttribute("data-target");
        document.getElementById(targetId).classList.toggle("d-none");
    });
});

