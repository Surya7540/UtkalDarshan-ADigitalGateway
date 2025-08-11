// In your PackageBook.js file

function handleSubmit(e) {
    e.preventDefault();
    if (!validateStep()) return;
    if (step < 4) return nextStep();

    // --- NEW LOGIC STARTS HERE ---
    // 1. Create a new booking object with all relevant data.
    const newBooking = {
        id: Date.now(), // A unique ID for the booking
        bookingDate: new Date().toISOString(),
        status: 'Pending', // Default status for new bookings
        formData: formData,
        travelers: travelers,
        selectedPackage: selectedPackage,
        totalPrice: totalPrice,
        nights: nights
    };

    // 2. Get existing bookings from localStorage, or start a new array.
    const existingBookings = JSON.parse(localStorage.getItem('allBookings')) || [];

    // 3. Add the new booking and save it back to localStorage.
    localStorage.setItem('allBookings', JSON.stringify([...existingBookings, newBooking]));
    // --- NEW LOGIC ENDS HERE ---

    // Final submit logic (this part remains the same)
    Swal.fire({
        title: "Booking Confirmed!",
        html:
            `<b>${formData.name}</b> - <b>₹${totalPrice.toLocaleString('en-IN')}</b><br>` +
            `<span style="font-size:0.91em"> Confirmation sent to: <b>${formData.email}</b></span>`,
        icon: "success",
    });
    setTimeout(() => window.print(), 1100); // Prompt printout
    setStep(0);
}