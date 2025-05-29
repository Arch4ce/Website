// Tunggu sampai DOM sepenuhnya dimuat
document.addEventListener('DOMContentLoaded', function() {
    
    // ========== Fungsi Utilitas ==========
    
    // Fungsi untuk menampilkan notifikasi
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.classList.add('notification', type);
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Fungsi debounce untuk optimize performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Fungsi validasi email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Fungsi validasi nomor telepon
    function isValidPhone(phone) {
        const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
        return phoneRegex.test(phone);
    }

    // ========== Navigasi Smooth Scroll ==========
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // ========== Product Grid Management ==========
    const productGrid = document.querySelector('.product-grid');
    const viewMoreBtn = document.getElementById('viewMoreBtn');

    // Fungsi untuk mengatur tampilan grid
    function adjustProductGrid() {
        if (window.innerWidth <= 1024 && window.innerWidth > 768) {
            productGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        } else if (window.innerWidth <= 768) {
            productGrid.style.gridTemplateColumns = 'repeat(1, 1fr)';
        } else {
            productGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
        }
    }

    // Event listener untuk tombol "Lihat Lebih"
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', function() {
            if (productGrid.classList.contains('expanded')) {
                productGrid.classList.remove('expanded');
                this.textContent = 'Lihat Lebih';
                document.querySelector('#products').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } else {
                productGrid.classList.add('expanded');
                this.textContent = 'Lihat Lebih Sedikit';
            }
        });
    }

    // ========== Lazy Loading Images ==========
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    // ========== Product Order Buttons ==========
    const orderButtons = document.querySelectorAll('.product-order-btn');
    
    orderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-info');
            const productTitle = productCard.querySelector('.product-title').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            
            // Scroll ke form kontak
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Auto-fill pesan di form
            const messageField = document.getElementById('message');
            if (messageField) {
                messageField.value = `Saya tertarik untuk memesan ${productTitle}\nHarga: ${productPrice}\n\nMohon informasi lebih lanjut.`;
            }
            
            // Focus pada field nama
            const nameField = document.getElementById('name');
            if (nameField) {
                nameField.focus();
            }
            
            // Animasi button
            this.classList.add('loading');
            const originalText = this.textContent;
            
            setTimeout(() => {
                this.classList.remove('loading');
                this.textContent = 'Ditambahkan ✓';
                showNotification('Silakan lengkapi form pemesanan', 'success');
                
                setTimeout(() => {
                    this.textContent = originalText;
                }, 2000);
            }, 1000);
        });
    });

    // ========== Contact Form Handling ==========
    const contactForm = document.getElementById('contactForm');
    const whatsappNumber = '6281295899271';
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;
            
            // Validasi form
            if (!name || !email || !phone || !message) {
                showNotification('Mohon lengkapi semua kolom form.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showNotification('Mohon masukkan alamat email yang valid.', 'error');
                return;
            }

            if (!isValidPhone(phone)) {
                showNotification('Mohon masukkan nomor telepon yang valid.', 'error');
                return;
            }
            
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.classList.add('loading');
            submitButton.disabled = true;
            
            try {
                const whatsappText = `*Pesan dari Website Bunga Cinta*%0A%0A*Nama:* ${name}%0A*Email:* ${email}%0A*Telepon:* ${phone}%0A*Pesan:* ${message}`;
                const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappText}`;
                
                window.open(whatsappURL, '_blank');
                contactForm.reset();
                showNotification('Form berhasil dikirim ke WhatsApp!', 'success');
            } catch (error) {
                showNotification('Terjadi kesalahan. Silakan coba lagi.', 'error');
            } finally {
                submitButton.classList.remove('loading');
                submitButton.disabled = false;
            }
        });
    }

    // ========== Image Lightbox ==========
    const productImages = document.querySelectorAll('.product-image img');
    
    productImages.forEach(image => {
        image.style.cursor = 'pointer';
        
        image.addEventListener('click', function() {
            const lightbox = document.createElement('div');
            lightbox.classList.add('lightbox');
            
            const lightboxImg = document.createElement('img');
            lightboxImg.src = this.src;
            
            lightbox.appendChild(lightboxImg);
            document.body.appendChild(lightbox);
            
            document.body.style.overflow = 'hidden';
            
            lightbox.addEventListener('click', function() {
                this.remove();
                document.body.style.overflow = '';
            });
        });
    });

    // ========== Scroll to Top Button ==========
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.classList.add('scroll-top');
    scrollTopBtn.innerHTML = '&#8679;';
    document.body.appendChild(scrollTopBtn);
    
    window.addEventListener('scroll', debounce(function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    }, 150));
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ========== Event Listeners ==========
    window.addEventListener('load', () => {
        adjustProductGrid();
        lazyLoadImages();
    });
    
    window.addEventListener('resize', debounce(adjustProductGrid, 250));

    // ========== Lightbox Style ==========
    const lightboxStyle = document.createElement('style');
    lightboxStyle.textContent = `
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            cursor: pointer;
        }
        
        .lightbox img {
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
        }
    `;
    document.head.appendChild(lightboxStyle);
});