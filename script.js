
  <script>
    // Slideshow functionality
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    let currentSlide = 0;
    
    function showSlide(index) {
      slides.forEach(slide => slide.classList.remove('active'));
      
      if (index >= slides.length) {
        currentSlide = 0;
      } else if (index < 0) {
        currentSlide = slides.length - 1;
      } else {
        currentSlide = index;
      }
      
      slides[currentSlide].classList.add('active');
    }
    
    prevButton.addEventListener('click', () => {
      showSlide(currentSlide - 1);
    });
    
    nextButton.addEventListener('click', () => {
      showSlide(currentSlide + 1);
    });
    
    // Auto advance slides
    setInterval(() => {
      showSlide(currentSlide + 1);
    }, 5000);
    
    // Accordion functionality with smooth animation
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
      header.addEventListener('click', () => {
        // Toggle active class for style
        header.classList.toggle('active');
        
        // Get the content panel
        const content = header.nextElementSibling;
        const inner = content.querySelector('.accordion-content-inner');
        
        // If open, close it
        if (content.style.maxHeight) {
          content.style.maxHeight = null;
        } else {
          // If closed, open it and set max-height to scrollHeight to enable animation
          content.style.maxHeight = inner.scrollHeight + "px";
        }
      });
    });
    
    // RSVP form functionality
    const rsvpForm = document.getElementById('rsvpForm');
    const attendanceSelect = document.getElementById('attendance');
    const guestsGroup = document.getElementById('guestsGroup');
    const mealGroup = document.getElementById('mealGroup');
    const successMessage = document.getElementById('successMessage');
    
    // Initialize Dexie.js for IndexedDB
    const db = new Dexie('WeddingRSVP');
    db.version(1).stores({
      responses: '++id, name, email, attendance, guests, meal, specialRequests, song, timestamp'
    });
    
    attendanceSelect.addEventListener('change', () => {
      if (attendanceSelect.value === 'yes') {
        guestsGroup.style.display = 'block';
        mealGroup.style.display = 'block';
      } else {
        guestsGroup.style.display = 'none';
        mealGroup.style.display = 'none';
      }
    });
    
    rsvpForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        attendance: document.getElementById('attendance').value,
        guests: attendanceSelect.value === 'yes' ? document.getElementById('numGuests').value : '0',
        meal: attendanceSelect.value === 'yes' ? document.getElementById('meal').value : '',
        specialRequests: document.getElementById('specialRequests').value,
        song: document.getElementById('song').value,
        timestamp: new Date().toISOString()
      };
      
      try {
        // Save to IndexedDB using Dexie
        await db.responses.add(formData);
        
        // Show success message
        rsvpForm.reset();
        successMessage.style.display = 'block';
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          successMessage.style.display = 'none';
        }, 5000);
        
        console.log('RSVP saved successfully', formData);
      } catch (error) {
        console.error('Error saving RSVP:', error);
        alert('There was an error saving your RSVP. Please try again.');
      }
    });
  </script>
