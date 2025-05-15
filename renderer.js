document.addEventListener("DOMContentLoaded", () => {

    // Mapping of select element IDs to their specific options
    const selectOptions = {
        "relation-hof": ["-- Select Relation --","Self", "Father", "Mother", "Husband", "Wife", "Son", "Daughter", "Grandson", "Grand-Daughter", "Brother", "Sister", "Daughter In-law", "Other"],
        "gender": ["-- Select Gender --", "Male", "Female"],
        "marital-Status": ["-- Select Marital Status --", "Married", "Single", "Divorcee", "Separated", "Widow / Widower"],
        "bloodGroup": ["-- Select Blood Group --", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-",],
        // "education": ["-- Select Education --", "Primary", "Secondary (10)", "Sr.Secondary (12)", "Graduate", "Post Graduate", "PHD", "Degree", "Diploma", "Others"],
        "occupation": ["-- Select Occupation --", "Service (Govt.)", "Service (Private)", "Self-Employed", "Business", "Retired", "Pensioner", "Un-employed","Housewife"],
        "income": ["-- Select Income --", "Below 2 Lacs", "2.1 To 8 Lacs", "8.1 To 12 Lacs", "12 Lacs & Above"],
        "masjid": ["-- Select Masjid --", "Rasoolpura", "Vazeehpura", "Moiyadpura", "Khanpura", "Khanjipeer", "Chamanpura", "Kharol-Colony", "Pulla", "Neemuch Kheda"]
    };

    // Function to populate a select element
    function populateSelect(selectElement, options) {
        options.forEach((option, index) => {
            const optionElement = document.createElement("option");
            optionElement.value = index === 0 ? "" : option; // Empty value for the first option
            optionElement.disabled = index === 0; // Disable the first option
            optionElement.selected = index === 0; // Select the first option
            optionElement.textContent = option;
            selectElement.appendChild(optionElement);
        });
    }

    // Loop through each select element and populate based on the mapping
    Object.keys(selectOptions).forEach(selectId => {
        const selectElement = document.getElementById(selectId);
        const options = selectOptions[selectId];
        populateSelect(selectElement, options);
    });


    // Function to reset form values
    function resetFormFields() {
        // Reset all input fields
        document.querySelectorAll("input").forEach(input => {
            if (input.type === "radio" || input.type === "checkbox") {
                input.checked = false;
            } else {
                input.value = "";
            }
        });
    
        // Reset all select dropdowns
        document.querySelectorAll("select").forEach(select => {
            select.selectedIndex = 0;
        });
    
        // Reset all textarea fields
        document.querySelectorAll("textarea").forEach(textarea => {
            textarea.value = "";
        });
    }
    
    // Function to show toast
    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        
        toast.style.position = 'fixed';
        toast.style.top = '20px';          // 🔥 Top mein
        toast.style.right = '20px';         // 🔥 Right side mein
        toast.style.backgroundColor = '#28a745'; // Nice green
        toast.style.color = '#fff';
        toast.style.padding = '15px 30px';  // 👉 Thoda bada padding
        toast.style.borderRadius = '8px';   // Rounded corners
        toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        toast.style.fontSize = '2.5rem';      // 👉 Text bhi bada
        toast.style.fontWeight = '500';    
        toast.style.zIndex = '10000';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s ease';
    
        document.body.appendChild(toast);
    
        // Animation: thoda sa fade-in effect
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
        });
    
        setTimeout(() => {
            // Fade out before removing
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.remove();
            }, 500); // Wait for fade-out animation
        }, 3000); // 3 seconds visible
    }

    flatpickr("#birthday", {
        dateFormat: "Y-M-d",
        altInput: true,
        altFormat: "Y-M-d",
        allowInput: true
    });

    const form = document.getElementById("user-form");
    const inputs = document.querySelectorAll("input");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        let relationWithHOF = document.getElementById("relation-hof").value;
        let gender = document.getElementById("gender").value;
        let maritalStatus = document.getElementById("marital-Status").value;
        let bloodGroup = document.getElementById("bloodGroup").value;
        let occupation = document.getElementById("occupation").value;
        let income = document.getElementById("income").value;
        let masjid = document.getElementById("masjid").value;

        if (relationWithHOF === "") {
            alert("Please select a relation before submitting!");
            return;
        }

        // 🔹 Collect form data
        const formData = {};
        inputs.forEach(input => {
            formData[input.id] = input.value.trim();
        });

        formData["relation-hof"] = relationWithHOF;
        formData["gender"] = gender;
        formData["marital-Status"] = maritalStatus;
        formData["bloodGroup"] = bloodGroup;
        formData["occupation"] = occupation;
        formData["income"] = income;
        formData["masjid"] = masjid;

        // ✅ Send data to main process
        window.electronAPI.saveData(formData);
        resetFormFields();
    });

    // 🔹 Receive confirmation message from main process
    window.electronAPI.onExcelUpdated((message) => {
        // ✅ Show alert with file path
        showToast("✅ Data saved to Excel", message);
    });
});