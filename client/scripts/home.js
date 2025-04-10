const API_BASE_URL = "http://localhost/faq-system/server/user/v1";

// Load FAQs from the API and update the UI.
async function loadFAQs() {
    try {
        const response = await axios.get(`${API_BASE_URL}/get_faqs.php`);
        console.log("API Response:", response.data);
        const faqs = response.data.faqs;

        const faqList = document.getElementById("faq-list");
        faqList.innerHTML = "";

        if (!faqs || faqs.length === 0) {
            faqList.innerHTML = "<p>No FAQs available.</p>";
            return;
        }

        faqs.forEach(faq => {
            console.log("FAQ Object:", faq);

            const faqItem = document.createElement("div");
            faqItem.classList.add("faq-item");
            faqItem.innerHTML = `
                <div class="faq-question">
                    <strong>${faq.question}</strong>
                    <span>▼</span>
                </div>
                <p class="faq-answer">${faq.answer}</p>
            `;

            faqItem.addEventListener("click", () => {
                faqItem.classList.toggle("active");
            });

            faqList.appendChild(faqItem);
        });

    } catch (error) {
        console.error("Error fetching FAQs:", error);
        document.getElementById("faq-list").innerHTML = "<p>Failed to load FAQs.</p>";
    }
}

// Open the modal to add a new FAQ.
function openFaqModal() {
    document.getElementById("faq-modal").style.display = "flex";
}

// Close the modal for adding a new FAQ and reset its content.
function closeFaqModal() {
    document.getElementById("faq-modal").style.display = "none";
    document.getElementById("faq-question").value = "";
    document.getElementById("faq-answer").value = "";
    document.getElementById("faq-errorMessage").innerText = "";
}

// Add a new FAQ via API call after validating input and token.
async function addFAQ() {
    const question = document.getElementById("faq-question").value.trim();
    const answer = document.getElementById("faq-answer").value.trim();
    const errorMessage = document.getElementById("faq-errorMessage");

    errorMessage.innerText = "";

    if (!question || !answer) {
        errorMessage.innerText = "Both fields are required!";
        return;
    }

    try {
        const token = localStorage.getItem("token");
        if (!token) {
            errorMessage.innerText = "Unauthorized. Please log in.";
            return;
        }

        const response = await axios.post(`${API_BASE_URL}/create_faq.php`, 
            { question, answer }, 
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.error) {
            errorMessage.innerText = response.data.error;
        } else {
            closeFaqModal();
            loadFAQs();
        }
    } catch (error) {
        errorMessage.innerText = "Failed to add FAQ. Please try again.";
    }
}

// Filter displayed FAQs based on the search query.
function filterFAQs() {
    const searchQuery = document.getElementById("faq-search").value.toLowerCase();
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question").textContent.toLowerCase();
        item.style.display = question.includes(searchQuery) ? "block" : "none";
    });
}

// Log out the user by clearing the token and redirecting to the homepage.
function logoutUser() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}
