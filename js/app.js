document.addEventListener("DOMContentLoaded", () => {
  // 1. Dynamic Background Parallax Effect
  const blobs = document.querySelectorAll(".blob");
  const floatIcons = document.querySelectorAll(".floating-icon");
  document.addEventListener("mousemove", (e) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const moveX = (clientX - centerX) / 30;
    const moveY = (clientY - centerY) / 30;

    blobs.forEach((blob, idx) => {
      const factor = (idx + 1) * 0.4;
      blob.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
    });

    floatIcons.forEach((icon, idx) => {
      const factor = (idx + 1) * 0.2;
      icon.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
    });
  });

  // 2. Typing Effect for Hero
  const typedTextSpan = document.getElementById("typed-text");
  const textArray = [
    "Sănătatea plămânilor tăi, misiunea mea.",
    "Diagnostic și tratament de specialitate.",
    "Fiecare respirație contează.",
    "Suport medical empatic și profesionist."
  ];
  const typingSpeed = 70;
  const erasingSpeed = 40;
  const newTextDelay = 2000;
  let textArrayIndex = 0;
  let charIndex = 0;

  function type() {
    if (charIndex < textArray[textArrayIndex].length) {
      typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, typingSpeed);
    } else {
      setTimeout(erase, newTextDelay);
    }
  }

  function erase() {
    if (charIndex > 0) {
      typedTextSpan.textContent = textArray[textArrayIndex].substring(
        0,
        charIndex - 1,
      );
      charIndex--;
      setTimeout(erase, erasingSpeed);
    } else {
      textArrayIndex++;
      if (textArrayIndex >= textArray.length) textArrayIndex = 0;
      setTimeout(type, typingSpeed + 500);
    }
  }

  // Start typing effect after 1s delay
  setTimeout(type, 1000);

  // 3. Header Scrolled Styling
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // 4. Mobile Menu Toggle
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // 5. Timeline Tabs Switcher
  const tabBtns = document.querySelectorAll(".tab-btn");
  const panes = document.querySelectorAll(".timeline-pane");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");

      tabBtns.forEach((b) => b.classList.remove("active"));
      panes.forEach((p) => p.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById(tabId).classList.add("active");
    });
  });

  // 6. Interactive Appointment Form & Modal
  const appointmentForm = document.getElementById("appointment-form");
  const modalOverlay = document.getElementById("modal-overlay");
  const closeModalBtn = document.getElementById("close-modal");
  const modalMsg = document.getElementById("modal-msg");

  // EmailJS Credentials Configuration
  // To receive real emails, Dr. Nicoleta Lup needs to create a free account on emailjs.com,
  // create a Service & Template, and replace these credentials:
  const EMAILJS_PUBLIC_KEY = "94qNt80kLHrRqBQ06";
  const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID"; // e.g. "service_default"
  const EMAILJS_TEMPLATE_ID = "template_i67a1w6"; // e.g. "template_appointment"

  // Initialize EmailJS if credentials are set
  if (
    typeof emailjs !== "undefined" &&
    EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY" &&
    EMAILJS_PUBLIC_KEY !== ""
  ) {
    emailjs.init({
      publicKey: EMAILJS_PUBLIC_KEY,
    });
  }

  // Helper function to escape HTML characters and prevent Cross-Site Scripting (XSS)
  function escapeHTML(str) {
    return str.replace(
      /[&<>'"]/g,
      (tag) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;",
        })[tag] || tag,
    );
  }

  appointmentForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const serviceSelect = document.getElementById("service");
    const serviceName = serviceSelect.options[serviceSelect.selectedIndex].text;
    const date = document.getElementById("date").value;
    const timeSelect = document.getElementById("time");
    const timeName = timeSelect.options[timeSelect.selectedIndex].text;
    const message = document.getElementById("message").value;

    // Formatting date
    const formattedDate = new Date(date).toLocaleDateString("ro-RO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const escapedName = escapeHTML(name);

    // Disable submit button and show loading state
    const submitBtn = appointmentForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Se trimite...";

    // Define success display
    const showSuccess = () => {
      // Populate success message securely
      modalMsg.innerHTML = `Stimate(ă) <strong>${escapedName}</strong>, solicitarea dumneavoastră pentru serviciul <strong>${serviceName}</strong> programată pe data de <strong>${formattedDate}</strong>, în intervalul <strong>${timeName}</strong>, a fost înregistrată. <br><br>Dr. Nicoleta Lup vă va contacta la numărul de telefon furnizat pentru confirmarea finală.`;

      // Show Modal
      modalOverlay.classList.add("active");

      // Reset Form and restore button
      appointmentForm.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    };

    // Check if EmailJS is configured
    if (
      typeof emailjs !== "undefined" &&
      EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY" &&
      EMAILJS_PUBLIC_KEY !== ""
    ) {
      const templateParams = {
        to_name: "Dr. Nicoleta Lup",
        from_name: name,
        from_phone: phone,
        from_email: email,
        service_requested: serviceName,
        requested_date: formattedDate,
        requested_time: timeName,
        message: message || "Fără mesaj suplimentar.",
      };

      emailjs
        .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(() => {
          showSuccess();
        })
        .catch((error) => {
          console.error("EmailJS Error:", error);
          alert(
            "Ne cerem scuze! A apărut o eroare la trimiterea programării. Vă rugăm să încercați din nou sau să ne contactați telefonic la (+40) 757 796 362.",
          );

          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        });
    } else {
      // Fallback simulation with 1.2s delay
      console.log(
        "EmailJS is not configured yet. Simulating mail transmission...",
      );
      setTimeout(() => {
        showSuccess();
      }, 1200);
    }
  });

  closeModalBtn.addEventListener("click", () => {
    modalOverlay.classList.remove("active");
  });

  // Close modal when clicking outside content
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove("active");
    }
  });

  // Set min date in datepicker to today
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("date").setAttribute("min", today);

  // 7. Scroll Spy (Active Menu Item based on section scroll)
  const sections = document.querySelectorAll("section");

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - 250) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
});
