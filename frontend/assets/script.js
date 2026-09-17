document.addEventListener("DOMContentLoaded", () => {
    const API_BASE_URL = "https://classiq-api-9ges.onrender.com/api";

    // Helpers
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const clearError = (input, error) => {
        error.textContent = "";
        input.style.borderColor = "";
    };

    const showError = (input, error, message) => {
        error.textContent = message;
        input.style.borderColor = "#EF4444";
    };

    const setButtonLoading = (button, text, loading) => {
        button.textContent = loading ? text : button.dataset.defaultText;
        button.disabled = loading;
        button.style.opacity = loading ? "0.7" : "1";
    };


    // Login
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        const submitBtn = document.getElementById("submitBtn");
        const emailError = document.getElementById("emailError");
        const passwordError = document.getElementById("passwordError");

        submitBtn.dataset.defaultText = submitBtn.textContent;

        emailInput.addEventListener("input", () => {
            clearError(emailInput, emailError);
        });

        passwordInput.addEventListener("input", () => {
            clearError(passwordInput, passwordError);
        });

        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = emailInput.value.trim();
            const password = passwordInput.value;

            let isValid = true;

            if (!email) {
                showError(emailInput, emailError, "Email is required");
                isValid = false;
            } else if (!validateEmail(email)) {
                showError(
                    emailInput,
                    emailError,
                    "Please enter a valid email address"
                );
                isValid = false;
            }

            if (!password) {
                showError(
                    passwordInput,
                    passwordError,
                    "Password is required"
                );
                isValid = false;
            } else if (password.length < 6) {
                showError(
                    passwordInput,
                    passwordError,
                    "Password must be at least 6 characters"
                );
                isValid = false;
            }

            if (!isValid) {
                return;
            }

            setButtonLoading(submitBtn, "Logging in...", true);

            try {
                const response = await fetch(
                    `${API_BASE_URL}/auth/login`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        credentials: "include",
                        body: JSON.stringify({
                            email,
                            password
                        })
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Login failed");
                }

                alert(`Welcome back, ${data.user.fullname}!`);

                window.location.href = "dashboard.html";
            } catch (error) {
                console.error("Login error:", error);

                passwordError.textContent =
                    error.message || "Unable to login. Please try again.";

                passwordInput.style.borderColor = "#EF4444";

                setButtonLoading(submitBtn, "", false);
            }
        });
    }


    // Signup
    const signupForm = document.getElementById("signupForm");

    if (signupForm) {
        const emailInput = document.getElementById("email");
        const nameInput = document.getElementById("fullname");
        const passwordInput = document.getElementById("password");
        const submitBtn = document.getElementById("submitBtn");

        const emailError = document.getElementById("emailError");
        const nameError = document.getElementById("nameError");
        const passwordError = document.getElementById("passwordError");

        submitBtn.dataset.defaultText = submitBtn.textContent;

        emailInput.addEventListener("input", () => {
            clearError(emailInput, emailError);
        });

        nameInput.addEventListener("input", () => {
            clearError(nameInput, nameError);
        });

        passwordInput.addEventListener("input", () => {
            clearError(passwordInput, passwordError);
        });

        signupForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = emailInput.value.trim();
            const fullname = nameInput.value.trim();
            const password = passwordInput.value;

            let isValid = true;

            if (!email) {
                showError(emailInput, emailError, "Email is required");
                isValid = false;
            } else if (!validateEmail(email)) {
                showError(
                    emailInput,
                    emailError,
                    "Please enter a valid email address"
                );
                isValid = false;
            }

            if (!fullname) {
                showError(
                    nameInput,
                    nameError,
                    "Full name is required"
                );
                isValid = false;
            } else if (fullname.length < 3) {
                showError(
                    nameInput,
                    nameError,
                    "Name must be at least 3 characters"
                );
                isValid = false;
            }

            if (!password) {
                showError(
                    passwordInput,
                    passwordError,
                    "Password is required"
                );
                isValid = false;
            } else if (password.length < 6) {
                showError(
                    passwordInput,
                    passwordError,
                    "Password must be at least 6 characters"
                );
                isValid = false;
            }

            if (!isValid) {
                return;
            }

            setButtonLoading(
                submitBtn,
                "Creating account...",
                true
            );

            try {
                const response = await fetch(
                    `${API_BASE_URL}/auth/signup`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        credentials: "include",
                        body: JSON.stringify({
                            fullname,
                            email,
                            password
                        })
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Signup failed");
                }

                alert(
                    `Account created successfully!\nWelcome ${fullname}!`
                );

                window.location.href = "login.html";
            } catch (error) {
                console.error("Signup error:", error);

                alert(
                    error.message ||
                    "Something went wrong. Please try again."
                );

                setButtonLoading(submitBtn, "", false);
            }
        });
    }


    // Newsletter subscription
    const subscribeForm = document.getElementById("subscribeForm");

    if (subscribeForm) {
        subscribeForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const emailInput = subscribeForm.querySelector(
                'input[type="email"]'
            );
            const button = subscribeForm.querySelector("button");

            if (!emailInput.value.trim()) {
                return;
            }

            const originalText = button.textContent;

            button.textContent = "Subscribed!";
            button.style.backgroundColor = "#84CC16";
            button.style.color = "#FFFFFF";
            emailInput.value = "";

            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = "";
                button.style.color = "";
            }, 3000);
        });
    }


    // Authentication
    const loadUser = async () => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/auth/me`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                return null;
            }

            const data = await response.json();

            return data.user;
        } catch (error) {
            console.error("Authentication check failed:", error);
            return null;
        }
    };


    // Update header for logged-in users
    const setupAuthentication = async () => {
        const authButtons = document.querySelector(".auth-buttons");

        if (!authButtons) {
            return;
        }

        const user = await loadUser();

        if (!user) {
            return;
        }

        authButtons.innerHTML = `
            <span class="user-greeting">
                Hi, ${user.fullname}
            </span>
            <a href="#" class="btn btn-login" id="logoutBtn">
                Logout
            </a>
        `;

        const logoutBtn = document.getElementById("logoutBtn");

        logoutBtn.addEventListener("click", async (event) => {
            event.preventDefault();

            logoutBtn.textContent = "Logging out...";
            logoutBtn.style.opacity = "0.7";
            logoutBtn.style.pointerEvents = "none";

            try {
                const response = await fetch(
                    `${API_BASE_URL}/auth/logout`,
                    {
                        method: "POST",
                        credentials: "include"
                    }
                );

                if (!response.ok) {
                    throw new Error("Logout failed");
                }

                window.location.reload();
            } catch (error) {
                console.error("Logout error:", error);

                alert("Unable to logout. Please try again.");

                logoutBtn.textContent = "Logout";
                logoutBtn.style.opacity = "1";
                logoutBtn.style.pointerEvents = "";
            }
        });
    };

    setupAuthentication();


    // Protect dashboard
    const protectDashboard = async () => {
        const isDashboard =
            window.location.pathname.endsWith("dashboard.html");

        if (!isDashboard) {
            return;
        }

        const user = await loadUser();

        if (!user) {
            window.location.href = "login.html";
            return;
        }

        const userName = document.getElementById("userName");

        if (userName) {
            userName.textContent = user.fullname;
        }
    };

    protectDashboard();


    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth"
            });
        });
    });


    // Scroll reveal
    const animatedElements = document.querySelectorAll(
        ".course-card, .features-content, .hero-content"
    );

    if ("IntersectionObserver" in window && animatedElements.length) {
        const observer = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -50px 0px"
            }
        );

        animatedElements.forEach((element) => {
            element.classList.add("reveal");
            observer.observe(element);
        });
    }



    const joinNowBtn = document.getElementById("joinNowBtn");

    if (joinNowBtn) {
        joinNowBtn.addEventListener("click", async (event) => {
            event.preventDefault();

            const user = await loadUser();

            if (user) {
                window.location.href = "dashboard.html";
            } else {
                window.location.href = "signup.html";
            }
        });
    }
});