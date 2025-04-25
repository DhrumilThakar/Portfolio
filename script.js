// Initialize EmailJS with your public key
emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key

// Handle form submission
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: this.name.value,
        email: this.email.value,
        subject: this.subject.value,
        message: this.message.value
    };

    // Send email using EmailJS
    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: "dhruvmilthakar@gmail.com" // Your email address
    })
    .then(function(response) {
        alert('Message sent successfully!');
        document.getElementById('contactForm').reset();
    }, function(error) {
        alert('Failed to send message. Please try again later.');
        console.error('Error:', error);
    });
});
