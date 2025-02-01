<script>
    import { onMount , onDestroy } from 'svelte';
    import { fade, slide, fly } from 'svelte/transition';
    import { writable } from 'svelte/store';
    
    const isNavbarVisible = writable(true);
    let lastScrollY = 0;
    let isIntersecting = writable({});
    
    let name = '';
  let email = '';
  let phone = '';
  let message = '';
  let loading = false;
  let successMessage = '';
  let errorMessage = '';

  async function handleSubmit(event) {
    event.preventDefault();
    successMessage = '';
    errorMessage = '';
    loading = true;

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message })
      });

      const data = await response.json();

      if (data.success) {
        successMessage = 'ข้อมูลถูกส่งเรียบร้อยแล้ว';
        name = '';
        email = '';
        phone = '';
        message = '';
      } else {
        errorMessage = data.error || 'เกิดข้อผิดพลาด';
      }
    } catch (error) {
      errorMessage = 'เชื่อมต่อเซิร์ฟเวอร์ล้มเหลว';
    } finally {
      loading = false;
    }
  }
    
  onMount(() => {
    const cards = document.querySelectorAll('[data-animate="fade-up"]');
    
    cards.forEach((card, index) => {
      card.style.setProperty('--index', index);
      card.style.opacity = '0';
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
          }
        });
      }, { threshold: 0.25 });

      observer.observe(card);
    });
  });
  
    onMount(() => {
        // Scroll handling
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            isNavbarVisible.set(currentScrollY < lastScrollY || currentScrollY < 100);
            lastScrollY = currentScrollY;
        };
        
        // Intersection Observer for animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isIntersecting.update(state => ({
                    ...state,
                    [entry.target.id]: entry.isIntersecting
                }));
            });
        }, {
            threshold: 0.1
        });
        
        // Observe sections
        document.querySelectorAll('section').forEach(section => {
            if (section.id) {
                observer.observe(section);
            }
        });
        
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    });
    

    const services = [
        {
            title: 'ออกแบบเว็บไซต์',
            description: 'ออกแบบเว็บไซต์ที่สวยงาม ทันสมัย ตอบโจทย์การใช้งาน',
            icon: '🎨',
            features: ['Responsive Design', 'UI/UX ที่ทันสมัย', 'SEO Friendly']
        },
        // ... (services remain the same)
    ];
  
// ตัวแปรสำหรับเก็บดัชนีของสไลด์ปัจจุบัน และจำนวนสไลด์ทั้งหมด
let currentIndex = 0;
let totalSlides = 0;

// ฟังก์ชันอัพเดทตำแหน่งของ slider
// ใช้ `translateX` เพื่อเลื่อนตำแหน่งของ slider ตามดัชนีปัจจุบัน
const updateSlider = () => {
    const slider = document.getElementById('slider');
    if (slider) {
        // ใช้ percentage ในการเลื่อนตำแหน่งของ slider
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;

        // อัพเดต indicators เพื่อแสดงสถานะของสไลด์ปัจจุบัน
        updateIndicators();
    }
};

// ฟังก์ชันอัพเดต indicators
// ทำให้ indicator ปัจจุบันเปลี่ยนสี เพื่อแสดงว่าอยู่ในสไลด์ใด
const updateIndicators = () => {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        if (index === currentIndex) {
            // เพิ่มสีสำหรับ indicator ปัจจุบัน
            indicator.classList.add('bg-blue-500');
            indicator.classList.remove('bg-gray-400');
        } else {
            // รีเซ็ตสีของ indicator อื่นๆ
            indicator.classList.add('bg-gray-400');
            indicator.classList.remove('bg-blue-500');
        }
    });
};

// ฟังก์ชันที่ทำงานเมื่อ component ถูก mount
// ใช้สำหรับตั้งค่าเริ่มต้นและเพิ่ม event listeners
onMount(() => {
    const slider = document.getElementById('slider');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const indicatorButtons = document.querySelectorAll('.indicator');

    if (slider) {
        // กำหนดจำนวนสไลด์ทั้งหมด
        totalSlides = slider.children.length;

        // ตั้งค่า style สำหรับแต่ละ slide เพื่อให้รองรับการเลื่อน
        Array.from(slider.children).forEach(slide => {
            slide.style.minWidth = '100%'; // แต่ละ slide กว้าง 100% ของ container
            slide.style.width = '100%';
            slide.style.flexShrink = '0'; // ป้องกันการย่อ
            slide.style.flexGrow = '0'; // ป้องกันการขยาย
        });

        // อัพเดตตำแหน่ง slider เพื่อให้เริ่มที่ภาพแรก
        updateSlider();
    }

    // ฟังก์ชันสำหรับเลื่อนไปยังสไลด์ถัดไป
    const handleNext = () => {
        currentIndex = (currentIndex + 1) % totalSlides; // วนกลับไปสไลด์แรกเมื่อถึงสไลด์สุดท้าย
        updateSlider();
    };

    // ฟังก์ชันสำหรับเลื่อนไปยังสไลด์ก่อนหน้า
    const handlePrev = () => {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides; // วนกลับไปสไลด์สุดท้ายเมื่อถึงสไลด์แรก
        updateSlider();
    };

    // ฟังก์ชันสำหรับคลิก indicator เพื่อเปลี่ยนสไลด์
    const handleIndicatorClick = (e) => {
        currentIndex = parseInt(e.target.getAttribute('data-slide'), 10); // อ่านค่าดัชนีจาก attribute
        updateSlider();
    };

    // เพิ่ม event listener ให้ปุ่มถัดไปและปุ่มก่อนหน้า
    nextButton?.addEventListener('click', handleNext);
    prevButton?.addEventListener('click', handlePrev);

    // เพิ่ม event listener ให้ indicators
    indicatorButtons.forEach(button => {
        button.addEventListener('click', handleIndicatorClick);
    });

    // ตั้งค่า autoplay ให้เลื่อนไปยังสไลด์ถัดไปทุก 5 วินาที
    const autoplay = setInterval(handleNext, 5000);

    // เพิ่ม event listener สำหรับ resize
    // เพื่อปรับตำแหน่งของ slider เมื่อขนาดหน้าจอเปลี่ยน
    const handleResize = () => {
        updateSlider();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup: ลบ event listeners และหยุด autoplay เมื่อ component ถูก destroy
    return () => {
        nextButton?.removeEventListener('click', handleNext);
        prevButton?.removeEventListener('click', handlePrev);
        indicatorButtons.forEach(button => {
            button.removeEventListener('click', handleIndicatorClick);
        });
        window.removeEventListener('resize', handleResize);
        clearInterval(autoplay); // หยุด autoplay
    };
});

let data = [];

  // ดึงข้อมูลจาก API
  const fetchData = async () => {
    const res = await fetch('/api/data');
    data = await res.json();
  };

  // ดึงข้อมูลเมื่อโหลดหน้า
  fetchData();

  onMount(() => {
    const cards = document.querySelectorAll('.static-card');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-card');
        }
      });
    }, { threshold: 0.25 });

    cards.forEach((card, index) => {
      card.style.transitionDelay = `${index * 0.15}s`;
      observer.observe(card);
    });
  });
</script>

<style>

 /* Default styles for Banner and Slider */
#banner img, 
.slider-img {
  width: 100%; /* ครอบคลุมความกว้าง */
  height: auto; /* รักษาสัดส่วน */
  object-fit: cover; /* ครอบคลุมพื้นที่โดยไม่เสียสัดส่วน */
  max-height: 730px; /* ความสูงสูงสุดสำหรับหน้าจอใหญ่ */
}

/* Mobile styles */
@media (max-width: 768px) {
  #banner img,
  .slider-img {
    max-width: 100%; /* จำกัดขนาดให้เท่ากับ container ของ Hero Section */
    max-height: 400px; /* ลดความสูงในหน้าจอเล็ก */
    margin: 0 auto; /* จัดกึ่งกลาง */
    object-fit: contain; /* แสดงภาพทั้งหมดในขนาดเล็ก */
  }
}

/* Tablet styles */
@media (min-width: 769px) and (max-width: 1024px) {
  #banner img,
  .slider-img {
    max-height: 600px; /* ความสูงเหมาะสมสำหรับแท็บเล็ต */
  }
}


@media (max-width: 768px) {
      .hero-button {
        font-size: 1.1rem !important; /* ขนาดที่เล็กลงสำหรับหน้าจอเล็ก */
    }
}


    @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
        100% { transform: translateY(0px); }
    }
    
  
    /* Responsive text sizes */
    @media (max-width: 768px) {
        
        .hero-button {
            font-size: 1rem;
            padding: 0.75rem 1.5rem;
            width: 100%;
        }
        .services-card {
                flex-wrap: nowrap;
                flex-direction: row;
                justify-content: center;
            }
    }
  .services-card {
                flex-wrap: nowrap;
                flex-direction: row;
                justify-content: center;
            }

    /* Add glass effect */
    .glass-card {
        background: rgba(255, 255, 255, 0.13);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
 
    .static-card{
        background: rgb(255, 255, 255);
        backdrop-filter: blur(10px);
        border: 2px solid #000000; /* เพิ่มความหนาของขอบและตั้งสีเป็นสีเทาเข้ม */
        border-radius: 8px;
        padding: 1rem;
        text-align: center;
        display: flex; /* ใช้ flexbox */
        flex-direction: column; /* ตั้งให้รูปภาพและข้อความอยู่ในคอลัมน์ */
        justify-content: center; /* จัดตำแหน่งแนวนอน */
        align-items: center; /* จัดตำแหน่งแนวตั้ง */
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        position: relative;
        overflow: visible;
    }

    .static-card img {
    width: 80px; /* กำหนดความกว้างของรูป */
    height: 80px; /* กำหนดความสูงของรูป */
    object-fit: cover; /* ให้รูปครอบพื้นที่เต็มโดยไม่ทำให้บิดเบือน */
    }

    .static-card:hover {
        transform: translateY(-10px) scale(1.02);
        box-shadow: 0 20px 30px rgba(0, 0, 0, 0.1);
    }



/* ปุ่มหลัก */
.hero-button {
  position: relative; /* จุดอ้างอิงสำหรับ hoverEffect */
  display: inline-flex; /* จัดเนื้อหาในปุ่มให้อยู่ตรงกลาง */
  align-items: center;
  justify-content: center;
  padding: 20px 40px; /* ขนาด padding สำหรับปุ่มขนาดใหญ่ */
  border: 0; /* ไม่มีเส้นขอบ */
  border-radius: 10rem; /* ขอบมน */
  overflow: hidden; /* ซ่อนส่วนที่เกิน */
  background: rgb(243, 243, 243); /* สีพื้นหลังปุ่ม */
  color: rgb(0, 0, 0); /* สีข้อความ */
  font-size: 1.2rem; /* ขนาดข้อความ */
  font-weight: bold;
  cursor: pointer;
  z-index: 0; /* ทำให้ hoverEffect อยู่ด้านหลัง */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2); /* เงาปุ่ม */
  transition: all 0.3s ease;
}

.hero-button:hover {
  background: rgb(255, 200, 150); /* สีพื้นหลังเมื่อ hover */
  color: rgb(7, 7, 7); /* สีข้อความเมื่อ hover */
}

.hero-button:active {
  transform: scale(0.97); /* ลดขนาดเล็กน้อยเมื่อคลิก */
}

/* เอฟเฟกต์ */
.hoverEffect {
  position: absolute; /* จัดตำแหน่งให้อยู่ในปุ่ม */
  top: 0;
  left: 0;
  width: 100%; /* ครอบคลุมพื้นที่ปุ่มทั้งหมด */
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: -1; /* อยู่ด้านหลังปุ่ม */
}

.hoverEffect div {
  background: linear-gradient(
    90deg,
    rgba(255, 165, 0, 1) 0%, /* สีส้ม */
    rgba(255, 223, 0, 1) 50%, /* สีเหลือง */
    rgba(255, 140, 0, 1) 100% /* สีส้มเข้ม */
  );
  border-radius: 50%; /* ทำให้เป็นวงกลม */
  width: 200%; /* ขยายขนาดให้ใหญ่กว่าปุ่ม */
  height: 200%;
  filter: blur(30px); /* เอฟเฟกต์เบลอ */
  opacity: 0.6;
  animation: effect 4s infinite ease-in-out; /* เพิ่มการหมุนแบบนุ่มนวล */
  transition: all 0.4s ease;
}

.hero-button:hover .hoverEffect div {
  width: 180%; /* ลดขนาดเมื่อ hover */
  height: 180%;
}

/* การหมุน */
@keyframes effect {
  0% {
    transform: rotate(0deg) scale(1);
  }
  20% {
    transform: rotate(20deg) scale(1.2); /* หมุนมากขึ้น */
  }
  40% {
    transform: rotate(-15deg) scale(1.1); /* หมุนกลับ */
  }
  60% {
    transform: rotate(10deg) scale(1.05); /* เอียงน้อยลง */
  }
  80% {
    transform: rotate(-5deg) scale(1.15); /* หมุนสลับกลับไป */
  }
  100% {
    transform: rotate(0deg) scale(1); /* กลับสู่ตำแหน่งเดิม */
  }
}



.title {
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -1px;
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 30px;
  color: #00bfff;
}

.title::before {
  width: 18px;
  height: 18px;
}

.title::after {
  width: 18px;
  height: 18px;
  animation: pulse 1s linear infinite;
}

.title::before,
.title::after {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  border-radius: 50%;
  left: 0px;
  background-color: #00bfff;
}

.message, 

.flex {
  display: flex;
  width: 100%;
  gap: 6px;
}



.input {
  font-size: medium;
}

.submit {
  border: none;
  outline: none;
  padding: 10px;
  border-radius: 10px;
  color: #fff;
  font-size: 16px;
  transform: .3s ease;
  background-color: #00bfff;
}

.submit:hover {
  background-color: #00bfff96;
}

@keyframes pulse {
  from {
    transform: scale(0.9);
    opacity: 1;
  }

  to {
    transform: scale(1.8);
    opacity: 0;
  }
}

/* From Uiverse.io by ayman-ashine */ 
.card-sub {
  --dark: #212121;
  --darker: #111111;
  --semidark: #2c2c2c;
  --lightgray: #e8e8e8;
  --unit: 10px;

  background-color: var(--darker);
  box-shadow: 0 0 var(--unit) var(--darker);
  border: calc(var(--unit) / 2) solid var(--darker);
  border-radius: var(--unit);
  position: relative;
  padding: var(--unit);
  overflow: hidden;

  max-width: 400px; /* ลดขนาดความกว้าง */
  padding: 1rem; /* ลด padding */
}

.card-sub::before {
  content: "";
  position: absolute;
  width: 120%;
  height: 20%;
  top: 40%;
  left: -10%;
  background: linear-gradient(144deg, #af40ff, #5b42f3 50%, #00ddeb);
  animation: keyframes-floating-light 2.5s infinite ease-in-out;
  filter: blur(20px);
}

@keyframes keyframes-floating-light {
  0% {
    transform: rotate(-5deg) translateY(-5%);
    opacity: 0.5;
  }

  50% {
    transform: rotate(5deg) translateY(5%);
    opacity: 1;
  }

  100% {
    transform: rotate(-5deg) translateY(-5%);
    opacity: 0.5;
  }
}

.card-sub::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0%;
  left: 0%;
  background: linear-gradient(144deg, #af40ff, #5b42f3 50%, #00ddeb);
  filter: blur(20px);
  pointer-events: none;
  animation: keyframes-intro 1s ease-in forwards;
}

@keyframes keyframes-intro {
  100% {
    ransform: translate(-100%);
    opacity: 0;
  }
}

.card-sub .image {
  width: 200px;
  animation: keyframes-floating-img 10s ease-in-out infinite;
}

@keyframes keyframes-floating-img {
  0% {
    transform: translate(-2%, 2%) scaleY(0.95) rotate(-5deg);
  }

  50% {
    transform: translate(2%, -2%) scaleY(1) rotate(5deg);
  }

  100% {
    transform: translate(-2%, 2%) scaleY(0.95) rotate(-5deg);
  }
}

.card-sub .heading {
  font-weight: 600;
  font-size: small;
  text-align: center;
  margin-top: calc(var(--unit) * -2);
  padding-block: var(--unit);
  color: var(--lightgray);
  animation: keyframes-flash-text 0.5s infinite;
}

@keyframes keyframes-flash-text {
  50% {
    opacity: 0.5;
  }
}

.card-sub .icons {
  display: flex;
  gap: var(--unit);
}

.card-sub .icons a {
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  
  color: var(--lightgray);
  padding: calc(var(--unit) / 2);
  border-radius: calc(var(--unit) / 2);
}

.card-sub .icons a:hover {
  transition: 0.2s;
  
  transform: translateY(-10px) scale(1.02);
}

.image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: auto;
}

.image {
    width: 100%;
    height: auto;
    max-width: 160px; /* กำหนดขนาดสูงสุดของรูป */
    object-fit: contain; /* ทำให้รูปคงสัดส่วน */
    border-radius: 50%; /* ถ้าต้องการให้เป็นวงกลม */
}

.card-price{
  width: 330px;
  min-height: 600px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.425); /* เพิ่มเงา */
}
.card-price:hover {
    transform: translateY(-10px); /* ยกการ์ดขึ้น */
    box-shadow: 0 10px 30px rgba(125, 91, 250, 0.712); /* เพิ่มเงา */
 
  }

/* Animation Keyframes */
@keyframes move-chevron {
  0%, 100% {
    transform: translateX(0) rotate(-90deg); /* ตำแหน่งเริ่มต้น */
  }
  50% {
    transform: translateX(5px) rotate(-90deg); /* เลื่อนมาทางขวา */
  }
}

@media (max-width: 768px) {
  .flex {
    flex-direction: column;
    gap: 2rem;
  }

}

:global(.flex-nowrap) {
    display: flex !important;
    flex-direction: row !important;
    width: 100% !important;
    min-width: 100% !important;
    transform-style: preserve-3d;
  }

  :global(#slider > div) {
        width: 100% !important;
        min-width: 100% !important;
        flex: 0 0 100% !important;
    }

    :global(#slider img) {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
    }
    /* เพิ่มการ transition สำหรับ slider */
#slider {
  scroll-behavior: smooth;
}

/* ป้องกันการเลือกข้อความเมื่อลากเมาส์ */
.slider-img {
  user-select: none;
  -webkit-user-drag: none;
}

/* Animation Keyframes */
@keyframes fade-up {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  .animate-fade-in-up {
    animation: fade-up 0.6s ease-out forwards;
  }

  /* Service Card Animations */
  [data-animate="fade-up"] {
    animation: fade-up 0.6s ease-out forwards;
    animation-delay: calc(var(--index) * 0.15s);
  }

  /* Hover Effect Enhancement */
  .services-card:hover img {
    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
  }
</style>

<svelte:head>
  <title>บริการออกแบบเว็บไซต์ | FULL WEB</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="บริการออกแบบและพัฒนาเว็บไซต์โดยนักศึกษา ทำให้ให้มีราคาถูกและมีประสิทธิภาพ" />
  <!-- Preconnect for Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Prompt:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Sarabun&display=swap" rel="stylesheet">
</svelte:head>

<!-- Banner Section -->
<section id="banner" class="w-full relative" style="background: linear-gradient(to bottom, #000000, #333333);">
  <img 
    src="/Pic_HH/banner-1.jpg"  
    sizes="(max-width: 768px) 100vw, (max-width: 1920px) 100vw" 
    alt="Website Banner">
</section>

<!-- Hero Section with Smaller Cards -->
<section id="services" class="py-10 bg-gradient-to-b from-black to-gray-800" >
  <div class="container mx-auto px-4">
    <h2 class="text-2xl md:text-3xl font-bold text-center text-white mb-8 md:mb-12 animate-fade-in-up">
      ทำไมต้องใช้บริการของเรา ?
    </h2>
    <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-4 justify-center ">
      <!-- Service 1 -->
      <div 
        class="services-card transform transition-all duration-500 ease-out 
               bg-white shadow-lg rounded-xl p-4 lg:p-6 hover:shadow-2xl 
               hover:-translate-y-3 w-[200px] lg:w-[200px] xl:w-[300px] mx-auto opacity-0 hover:z-10"
        data-animate="fade-up"
      >
        <img 
          src="/Pic_HH/heart.png"
          alt="Service Icon" 
          class="w-10 h-10 lg:w-16 lg:h-16 mx-auto mb-2 lg:mb-4 transition-transform 
               duration-300 hover:scale-110"
        />
        <h3 class="text-sm lg:text-lg font-medium text-gray-700 text-center">
          ออกแบบตรงใจ<br>ตามความต้องการ
        </h3>
      </div>
    
      <!-- Service 2 -->
      <div 
        class="services-card transform transition-all duration-500 ease-out 
               bg-white shadow-lg rounded-xl p-4 lg:p-6 hover:shadow-2xl 
               hover:-translate-y-3 w-[200px] lg:w-[200px] xl:w-[300px] mx-auto opacity-0 hover:z-10"
        data-animate="fade-up"
      >
        <img 
          src="/Pic_HH/coin.png"
          alt="Service Icon" 
          class="w-10 h-10 lg:w-16 lg:h-16 mx-auto mb-2 lg:mb-4 transition-transform 
               duration-300 hover:scale-110"
        />
        <h3 class="text-sm lg:text-lg font-medium text-gray-700 text-center">
          ปรึกษาฟรี<br>ไม่มีค่าใช้จ่าย
        </h3>
      </div>
    
      <!-- Service 3 -->
      <div 
        class="services-card transform transition-all duration-500 ease-out 
               bg-white shadow-lg rounded-xl p-4 lg:p-6 hover:shadow-2xl 
               hover:-translate-y-3 w-[200px] lg:w-[200px] xl:w-[300px] mx-auto opacity-0 hover:z-10"
        data-animate="fade-up"
      >
        <img 
          src="\Pic_HH\connection.png"
          alt="Service Icon" 
          class="w-10 h-10 lg:w-16 lg:h-16 mx-auto mb-2 lg:mb-4 transition-transform 
               duration-300 hover:scale-110"
        />
        <h3 class="text-sm lg:text-lg font-medium text-gray-700 text-center">
          ใช้งานได้ทั้งมือถือ<br>และคอมพิวเตอร์
        </h3>
      </div>
    
      <!-- Service 4 -->
      <div 
        class="services-card transform transition-all duration-500 ease-out 
               bg-white shadow-lg rounded-xl p-4 lg:p-6 hover:shadow-2xl 
               hover:-translate-y-3 w-[200px] lg:w-[200px] xl:w-[300px] mx-auto opacity-0 hover:z-10"
        data-animate="fade-up"
      >
        <img 
          src="\Pic_HH\like-2.png"
          alt="Service Icon" 
          class="w-10 h-10 lg:w-16 lg:h-16 mx-auto mb-2 lg:mb-4 transition-transform 
               duration-300 hover:scale-110"
        />
        <h3 class="text-sm lg:text-lg font-medium text-gray-700 text-center">
          ใช้งานง่าย<br>ไม่ว่าใครก็ใช้ได้
        </h3>
      </div>
    
  </div>

</section>



<section class="bg-gradient-to-b from-gray-800 to-black py-12 md:py-16">
  <div class="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Slider Images -->
    <div id="slider" class="flex flex-nowrap w-full transition-transform duration-500 gap-0">
      <!-- รูปสไลด์ 1 -->
      <div class="slider-img flex-none w-full">
        <img src="/Pic_HH/Responsive.jpg" alt="Slide 1" class="w-full h-auto m-0 p-0">
      </div>
      <!-- รูปสไลด์ 2 -->
      <div class="slider-img flex-none w-full">
        <img src="/Pic_HH/Desing.jpg" alt="Slide 2" class="w-full h-auto m-0 p-0">
      </div>
      <!-- รูปสไลด์ 3 -->
      <div class="slider-img flex-none w-full">
        <img src="\Pic_HH\Performance.jpg" alt="Slide 3" class="w-full h-auto m-0 p-0">
      </div>
    </div>

    <!-- Navigation Buttons -->
    <button
  id="prevButton"
  class="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/20 text-white rounded-full p-3 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-110 shadow-lg"
  aria-label="Previous slide"
>
  <svg 
    class="w-6 h-6" 
    fill="none" 
    stroke="currentColor" 
    stroke-width="2" 
    viewBox="0 0 24 24"
  >
    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
</button>

<button
  id="nextButton"
  class="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/20 text-white rounded-full p-3 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-110 shadow-lg"
  aria-label="Next slide"
>
  <svg 
    class="w-6 h-6" 
    fill="none" 
    stroke="currentColor" 
    stroke-width="2" 
    viewBox="0 0 24 24"
  >
    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
  </svg>
</button>
  </div>
</section>

<!-- Services Section with Glass Effect -->
<section id="services" class="py-20 bg-gradient-to-b from-black to-gray-800" >
    <div class="container mx-auto px-4 md:px-8">
      <h2 class="text-[35px] md:text-5xl font-bold text-left mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FFA500]">
        บริการรับทำเว็บไซต์แบบ Static Website
    </h2>
        <p class="mb-8 text-white">
            สร้างเว็บไซต์สวยงาม เรียบง่าย เหมาะสำหรับธุรกิจที่ต้องการความชัดเจน
        </p>
        <div class="relative inline-block mb-10">
            <h2 class="text-xl md:text-2xl  text-left text-white font-bold">
                ทำไมถึงต้องเลือกทำ Static Web ?
            </h2>
            <div class="absolute left-0  w-full h-1 rounded-full" 
                 style="background: linear-gradient(90deg, #FFD166, #FB974F);"></div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {#each services as service, i}
                <!-- 1 -->
                <div class="static-card glass-card rounded-xl p-8 shadow-lg mx-auto h-[200px] w-full xl:w-[300px] xl:h-[250px]">
                    <h1 class="text-l md:text-xl  font-bold ">โหลดเร็ว</h1>
                    <img src="/Pic_HH/fast.png" alt="fastload" class="w-full h-full ">
                    <p class="text-gray-600 text-[15px]">
                        เว็บไซต์แบบ Static ใช้ทรัพยากรน้อย จึงโหลดได้อย่างรวดเร็ว ตอบโจทย์ผุ้ใช้งาน ที่ต้องการเข้าถึงข้อมูลอย่างรวดเร็ว
                    </p>
                </div>
                <!-- 2 -->
                <div class="static-card glass-card rounded-xl p-8 shadow-lg mx-auto h-[200px] w-full xl:w-[300px] xl:h-[250px]">
                <h1 class="text-l md:text-xl  font-bold">ความปลอดภัยสูง</h1>
                <img src="/Pic_HH/shield.png" alt="fastload" class="w-full h-full mt-2 mb-2">
                <p class="text-gray-600">
                    ไม่มีระบบฐานข้อมูลหรือการโต้ตอบที่ซับซ้อน ลดความเสี่ยงจากการถูกโจมตี
                </p>
                </div>
                <!-- 3 -->
                <div class="static-card glass-card rounded-xl p-8 shadow-lg mx-auto h-[200px] w-full xl:w-[300px] xl:h-[250px]">
                <h1 class="text-l md:text-xl  font-bold">ประหยัดค่าใช้จ่าย</h1>
                <img src="/Pic_HH/coin.png" alt="fastload" class="w-full h-full mt-2 mb-2">
                <p class="text-gray-600">
                    ค่าใช้จ่ายในการพัฒนาและดูแลรักษาต่ำ 
                    เหมาะสำหรับธุรกิจขนาดเล็กหรือผู้เริ่มต้น
                </p>
                </div>
                <!-- 4 -->
                <div class="static-card glass-card rounded-xl p-8 shadow-lg mx-auto h-[200px] w-full xl:w-[300px] xl:h-[250px]">
                <h1 class="text-xl font-bold">ใช้งานง่าย</h1>
                <img src="/Pic_HH/like.png" alt="fastload" class="w-full h-full mt-2 mb-2">
                <p class="text-gray-600">
                    เหมาะสำหรับการแสดงข้อมูล เช่น แนะนำธุรกิจ รายละเอียดสินค้า/บริการ 
                </p>
                </div>
            {/each}
        </div>
    </div> 
    
    
    <div class="container mx-auto px-4 md:px-8">
      <div class="relative inline-block mb-10 mt-11">
        <h2 class="text-2xl  text-left  font-bold text-white">
            เลือกแพ็กเกจที่เหมาะกับคุณ
        </h2>
        <div class="absolute left-0  w-full h-1 rounded-full" 
             style="background: linear-gradient(90deg, #FFD166, #FB974F);"></div>
      </div>

      <div class="flex flex-wrap justify-center gap-4">
      <!-- การ์ดที่ 1 -->
  <div class="card-price max-w-sm lg:max-w-none mx-auto pt-10 px-5 pb-8 bg-white rounded-3xl shadow-lg relative overflow-hidden group hover:scale-105 transition-transform duration-500">
    <!-- กรอบนีออน -->
    <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500 opacity-50 group-hover:opacity-100 blur-lg transition-opacity duration-500"></div>
    <div class="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-gradient-to-br from-purple-600 via-blue-500 to-pink-500 transition-all duration-500"></div>

    <div class="relative text-center mb-6 z-10">
      <h5 class="text-2xl font-semibold text-black mb-3">Basic</h5>
      <span class="block text-5xl font-bold text-black mb-3">3,900 บาท</span>
      <a href="#contact"
        class="relative group inline-block w-full py-4 px-6 text-center text-white bg-green-500 font-semibold rounded-full overflow-hidden transition duration-200 hover:bg-gradient-to-r from-green-400 to-green-600">
        <div class="absolute top-0 right-full w-full h-full bg-gray-900 transform group-hover:translate-x-full group-hover:scale-102 transition duration-500"></div>
        <span class="relative">ธุรกิจขนาดเล็กหรือผู้เริ่มต้น</span>
      </a>
    </div>
    <ul class="relative z-10">
      <li class="mb-4">
        <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
        <span class="text-black">ออกแบบเว็บไซต์ฟรี !!</span>
      </li>
      <li class="mb-4">
        <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
        <span class="text-black">จำนวนหน้าเว็บไซต์ (1-2 หน้า)</span>
      </li>
      <li class="mb-4">
        <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
        <span class="text-black">รองรับทุกอุปกรณ์ คอมพิวเตอร์
          <span class="block pl-9">โทรศัพท์ แท็บเล็ต</span>
        </span>
      </li>
      <li class="mb-4">
        <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
        <span class="text-black">โฮสติ้งฟรี 1 ปี</span>
      </li>
      <li class="mb-4">
        <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
        <span class="text-black">จดโดเมน .com ฟรี 1 ปี</span>
      </li>
    </ul>
  </div>


        <!-- การ์ดที่ 2 -->
  <div class="card-price max-w-sm lg:max-w-none mx-auto pt-10 px-5 pb-8 bg-white rounded-3xl shadow-lg relative overflow-hidden group hover:scale-105 transition-transform duration-500">
    <!-- กรอบนีออน -->
    <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500 opacity-50 group-hover:opacity-100 blur-lg transition-opacity duration-500"></div>
    <div class="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-gradient-to-br from-purple-600 via-blue-500 to-pink-500 transition-all duration-500"></div>

    <div class="relative text-center mb-6 z-10">
      <h5 class="text-2xl font-semibold text-black mb-3">Standard</h5>
      <span class="block text-5xl font-bold text-black mb-3">4,900 บาท</span>
      <a href="#contact"
        class="relative group inline-block w-full py-4 px-6 text-center text-white bg-green-500 font-semibold rounded-full overflow-hidden transition duration-200 hover:bg-gradient-to-r from-green-400 to-green-600">
        <div class="absolute top-0 right-full w-full h-full bg-gray-900 transform group-hover:translate-x-full group-hover:scale-102 transition duration-500"></div>
        <span class="relative">ธุรกิจที่กำลังเติบโต</span>
      </a>
    </div>
    <ul class="relative z-10">
      <li class="mb-4">
        <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
        <span class="text-black">ออกแบบเว็บไซต์ฟรี !!</span>
      </li>
      <li class="mb-4">
        <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
        <span class="text-black">จำนวนหน้าเว็บไซต์ (3-5 หน้า)</span>
      </li>
      <li class="mb-4">
        <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
        <span class="text-black">รองรับทุกอุปกรณ์ คอมพิวเตอร์
          <span class="block pl-9">โทรศัพท์ แท็บเล็ต</span>
        </span>
      </li>
      <li class="mb-4">
        <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
        <span class="text-black">โฮสติ้งฟรี 1 ปี</span>
      </li>
      <li class="mb-4">
        <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
        <span class="text-black">จดโดเมน .com ฟรี 1 ปี</span>
      </li>
    </ul>
  </div>

        <!-- การ์ดที่ 3 -->
  <div class="card-price max-w-sm lg:max-w-none mx-auto pt-10 px-5 pb-8 bg-white rounded-3xl shadow-lg relative overflow-hidden group hover:scale-105 transition-transform duration-500">
    <!-- กรอบนีออน -->
    <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500 opacity-50 group-hover:opacity-100 blur-lg transition-opacity duration-500"></div>
    <div class="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-gradient-to-br from-purple-600 via-blue-500 to-pink-500 transition-all duration-500"></div>

    <div class="relative text-center mb-6 z-10">
      <h5 class="text-2xl font-semibold text-black mb-3">Premium</h5>
      <span class="block text-5xl font-bold text-black mb-3">9,900 บาท</span>
      <a href="#contact"
        class="relative group inline-block w-full py-4 px-6 text-center text-white bg-green-500 font-semibold rounded-full overflow-hidden transition duration-200 hover:bg-gradient-to-r from-green-400 to-green-600">
        <div class="absolute top-0 right-full w-full h-full bg-gray-900 transform group-hover:translate-x-full group-hover:scale-102 transition duration-500"></div>
        <span class="relative">ธุรกิจที่ต้องการความพรีเมียม</span>
      </a>
    </div>
    <ul class="relative z-10">
      <li class="mb-4">
        <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
        <span class="text-black">ออกแบบเว็บไซต์ฟรี !!</span>
      </li>
      <li class="mb-4">
        <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
        <span class="text-black">จำนวนหน้าเว็บไซต์ (6-8 หน้า)</span>
      </li>
      <li class="mb-4">
        <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
        <span class="text-black">ฟีเจอร์เพิ่มเติม เช่น แบบฟอร์มติดต่อ</span>
      </li>
      <li class="mb-4">
        <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
        <span class="text-black">รองรับทุกอุปกรณ์ คอมพิวเตอร์
          <span class="block pl-9">โทรศัพท์ แท็บเล็ต</span>
        </span>
      </li>
      <li class="mb-4">
        <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
        <span class="text-black">โฮสติ้งฟรี 1 ปี</span>
      </li>
      <li class="mb-4">
        <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
        <span class="text-black">จดโดเมน .com ฟรี 1 ปี</span>
      </li>
      <li class="mb-4">
        <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
        <span class="text-black">การติดตั้ง SSL Certificate ฟรี</span>
      </li>
    </ul>
  </div>

        <!-- การ์ดที่ 4 -->
  <div class="card-price max-w-sm lg:max-w-none mx-auto pt-10 px-5 pb-8 bg-white rounded-3xl shadow-lg relative overflow-hidden group hover:scale-105 transition-transform duration-500">
    <!-- กรอบนีออน -->
    <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500 opacity-50 group-hover:opacity-100 blur-lg transition-opacity duration-500"></div>
    <div class="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-gradient-to-br from-purple-600 via-blue-500 to-pink-500 transition-all duration-500"></div>

    <div class="relative text-center mb-6 z-10">
      <h5 class="text-2xl font-semibold text-black mb-3">Enterprise</h5>
      <span class="block text-5xl font-bold text-black mb-3">19,000 บาท</span>
      <a href="#contact"
        class="relative group inline-block w-full py-4 px-6 text-center text-white bg-green-500 font-semibold rounded-full overflow-hidden transition duration-200 hover:bg-gradient-to-r from-green-400 to-green-600">
        <div class="absolute top-0 right-full w-full h-full bg-gray-900 transform group-hover:translate-x-full group-hover:scale-102 transition duration-500"></div>
        <span class="relative">องค์กรหรือโปรเจคขนาดใหญ่</span>
      </a>
    </div>
    <ul class="relative z-10">
      <li class="mb-4">
        <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
        <span class="text-black">ออกแบบเว็บไซต์ฟรี !!</span>
      </li>
      <li class="mb-4">
        <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
        <span class="text-black">จำนวนหน้าเว็บไซต์ (10 หน้า +)</span>
      </li>
      <li class="mb-4">
        <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
        <span class="text-black">ฟีเจอร์เพิ่มเติม เช่น แบบฟอร์มติดต่อ </span>
      </li>
      <li class="mb-4">
        <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
        <span class="text-black">ระบบสมาชิกหรือระบบการจอง </span>
      </li>
      <li class="mb-4">
        <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
        <span class="text-black">ระบบจัดการหลังบ้าน</span>
      </li>
      <li class="mb-4">
        <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
        <span class="text-black">รองรับทุกอุปกรณ์ คอมพิวเตอร์
          <span class="block pl-9">โทรศัพท์ แท็บเล็ต</span>
        </span>
      </li>
      <li class="mb-4">
        <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
        <span class="text-black">โฮสติ้งฟรี 1 ปี</span>
      </li>
      <li class="mb-4">
        <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
        <span class="text-black">จดโดเมน .com ฟรี 1 ปี</span>
      </li>
      <li class="mb-4">
        <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
        <span class="text-black">การติดตั้ง SSL Certificate ฟรี</span>
      </li>
    </ul>
  </div>


            

</section>

<!-- ขั้นตอนการสั่งทำ -->
<section id="step" class="bg-gradient-to-b from-gray-800 to-black ">

  <div class="container mx-auto px-4 md:px-8  ">
    <h2 class=" text-3xl md:text-5xl font-bold text-left md:mb-3 text-white" style="font-family: 'Sarabun', sans-serif;">
      วิธีการทำเว็บไซต์กับเราง่ายมาก
    </h2>
    <div class="hero-button px-6 md:px-8 py-3 md:py-4 font-bold rounded-3xl 
                     shadow-lg hover:shadow-xl transition-all mt-4 md:mt-5 mb-5 text-black ">
      สั่งงานง่ายมีเพียง 4 ขั้นตอน !!
      <div class="hoverEffect">
        <div></div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-4">
      
      <!-- Card 1 -->
       
      <div class="static-card glass-card rounded-xl p-8 shadow-lg ">
        <h1 class="text-2xl  font-bold mb-5">1. พูดคุยและวางแผน</h1>
        <img src="\Pic_HH\talk-2.png" alt="talk" class="w-full h-full mb-5">
        <p class="text-gray-600">
          ติดต่อเราเพื่อแจ้งรายละเอียดเว็บไซต์
          ที่ต้องการ เช่น ประเภท, เนื้อหา
          และดีไซน์ที่ชอบ
        </p>
      </div>


      <!-- Card 2 -->
      <div class="static-card glass-card rounded-xl p-8 shadow-lg">
        <h1 class="text-2xl  font-bold mb-5">2. เสนอราคาและเริ่มงาน</h1>
        <img src="\Pic_HH\coin.png" alt="coin" class="w-full h-full mb-5">
        <p class="text-gray-600">
          ทางเราจะประเมินราคาและ
          แจ้งระยะเวลาในการทำงาน
          ลูกค้าชำระมัดจำเพื่อเริ่มงานได้เลย
        </p>
      </div>


      <!-- Card 3 -->
      <div class="static-card glass-card rounded-xl p-8 shadow-lg">
        <h1 class="text-2xl  font-bold mb-5">3. พัฒนาและตรวจสอบ</h1>
        <img src="\Pic_HH\man.png" alt="man" class="w-full h-full mb-5">
        <p class="text-gray-600">
          เราออกแบบและพัฒนาเว็บไซต์
          พร้อมส่งให้ลูกค้าเพื่อตรวจสอบ
          และแก้ไขได้หากมีข้อผิดพลาด
        </p>
      </div>

    

      <!-- Card 4 -->
      <div class="static-card glass-card rounded-xl p-8 shadow-lg">
        <h1 class="text-2xl  font-bold mb-5">4. ส่งมอบเว็บไซต์</h1>
        <img src="\Pic_HH\png_xmz7g.png" alt="hand" class="w-full h-full mb-5">
        <p class="text-gray-600">
          อับโหลดเว็บไซต์ให้พร้อมใช้งาน
          สามารถใช้งานเว็บไซต์ได้เลย
          และบริการหลังการขายเบื้องต้น
        </p>
      </div>
    </div>
  </div>
</section>


<section id="contact" class="py-20 bg-gradient-to-b from-black via-gray-900 to-blue-900 ">
  <div class="container mx-auto px-4 md:px-8">
    <h2 class="text-4xl md:text-5xl font-bold text-left mb-12 text-white">ช่องทางการติดต่อ</h2>
    <div class="flex flex-wrap lg:flex-nowrap gap-8">
      <!-- Left Section -->
      <div class="w-full lg:w-1/2 space-y-8">
        
        <!-- Card Section -->
        <div class="card-sub md:mt-11 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 mx-auto">
          <div class="image-container mb-4">
            <img class="image w-full rounded-lg" alt="Social Media" src="https://uiverse.io/astronaut.png" />
          </div>
          <div class="heading text-lg font-semibold text-center mb-4 text-gray-800">We're on Social Media</div>

          <div class="icons flex-row justify-center space-x-6 mb-4 ">
            <!-- Facebook -->
            <div class="relative group ">
              <a class="facebook " href="https://www.facebook.com/HighHopeSoft">
                <img src="\Pic_HH\facebook-icon.png " alt="Facebook Icon" style="width: 24px; height: 24px;">
              </a>
              <!-- Tooltip -->
              <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 text-sm text-white bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Facebook
              </div>
            </div>

            <!-- Instagram -->
            <div class="relative group">
              <a class="instagram" href="https://www.instagram.com/high_hope.soft?igsh=MWd1Nmtjdno4ajJtag%3D%3D&utm_source=qr">
                <img src="\Pic_HH\ig-icon.png" alt="Instagram Icon" style="width: 24px; height: 24px;">
              </a>
              <!-- Tooltip -->
              <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 text-sm text-white bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Instagram
              </div>
            </div>

            <!-- Line -->
            <div class="relative group">
              <a class="line" href="https://line.me/ti/p/YOUR_LINE_ID">
                <img src="\Pic_HH\line-icon.png" alt="Line Icon" style="width: 24px; height: 24px;">
              </a>
              <!-- Tooltip -->
              <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 text-sm text-white bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Line
              </div>
            </div>
          </div>

          <!-- New section below icons (same width as card) -->
          <div class="w-full flex justify-center">
            <div class="relative group w-full">
              <!-- Example of a new box or item, could be a link, text, or another icon -->
              <div class="bg-gray-100 p-4 rounded-lg shadow-md text-center mb-2">
                <p class="text-sm text-gray-700">HH.Soft - บริการออกแบบและทำเว็บไซต์ครบวงจร </p>
              </div>

              <div class="bg-gray-100 p-4 rounded-lg shadow-md text-center mb-2">
                <p class="text-sm text-gray-700">หมายเลขโทรศัพท์ : 0936150842</p>
              </div>

              <div class="bg-gray-100 p-4 rounded-lg shadow-md text-center">
                <p class="text-sm text-gray-700">Line ID : @HH.Soft</p>
              </div>

            </div>
          </div>
        </div>
      </div>

      <!-- Right Section -->
      <form on:submit={handleSubmit} class="w-full lg:w-1/2 bg-gray-50 p-8 rounded-lg shadow-lg">
        <p class="title text-2xl font-bold mb-4">ส่งข้อมูล</p>
        <p class="message mb-8">ทางทีมงานจะตอบกลับภายในระยะเวลา 24 ชม.</p>
        <label class="block mb-4">
          <span class="block text-gray-600 mt-2 mb-2">ชื่อ</span>
          <input class="input w-full p-3 border border-gray-300 rounded" bind:value={name} type="text" placeholder="" required>
        </label>
        <label class="block mb-4">
          <span class="block text-gray-600 mt-2 mb-2">อีเมล</span>
          <input class="input w-full p-3 border border-gray-300 rounded" bind:value={email} type="email" placeholder="" required>
        </label>
        <label class="block mb-4">
          <span class="block text-gray-600 mt-2 mb-2">หมายเลขโทรศัพท์</span>
          <input class="input w-full p-3 border border-gray-300 rounded" bind:value={phone} type="tel" placeholder="" required>
        </label>
        <label class="block mb-4">
          <span class="block text-gray-600 mt-2 mb-2">ข้อความ</span>
          <textarea class="input w-full p-3 border border-gray-300 rounded" bind:value={message} placeholder="" required></textarea>
        </label>
        <button class="submit bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" type="submit" disabled={loading}>
          {#if loading}กำลังส่ง...{:else}ส่งข้อมูล{/if}
        </button>
        {#if successMessage}
  <p class="text-green-500">{successMessage}</p>
{/if}
{#if errorMessage}
  <p class="text-red-500">{errorMessage}</p>
{/if}
      </form>
    </div>
  </div>
</section>


















