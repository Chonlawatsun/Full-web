<script>
    import { onMount } from 'svelte';
    import { fade, slide, fly } from 'svelte/transition';
    import { writable } from 'svelte/store';
    
    const isNavbarVisible = writable(true);
    let lastScrollY = 0;
    let isIntersecting = writable({});
    
    // Form handling
    let formData = {
        name: '',
        email: '',
        message: ''
    };
     
    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your form submission logic here
        console.log('Form submitted:', formData);
        // Reset form
        formData = {
            name: '',
            email: '',
            message: ''
        };
    };
    
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

    
    
</script>

<style>
  #carousel {
    display: flex;
    gap: 1rem; /* เพิ่มช่องว่างระหว่างภาพ */
    transition: transform 0.5s ease-in-out;
}

#carousel img {
    max-height: 600px; /* จำกัดความสูงของภาพ */
    object-fit: cover; /* ปรับให้ภาพไม่บิดเบี้ยว */
    border-radius: 0.5rem; /* เพิ่มมุมโค้ง */
}

  /* จัดการขนาด Banner */
  #banner img {
    width: 100%; /* ให้ภาพเต็มความกว้างหน้าจอ */
    height: auto; /* ปรับความสูงตามสัดส่วนของภาพ */
    max-height: 730px; /* กำหนดความสูงสูงสุดเท่ากับภาพต้นฉบับ */
    object-fit: cover; /* ครอบคลุมพื้นที่หน้าจอโดยไม่เสียสัดส่วน */
    display: block; /* ป้องกันปัญหาช่องว่างรอบภาพ */
    margin: 0 auto; /* จัดกึ่งกลาง */
  }


/* ปรับขนาด Banner สำหรับหน้าจอเล็ก */
@media (max-width: 768px) {
    #banner img {
      max-height: 400px; /* ลดความสูงของ Banner สำหรับหน้าจอเล็ก */
      object-fit: contain; /* แสดงภาพทั้งหมดในขนาดเล็ก */
    }
  }
  /* ปรับขนาด Banner สำหรับ Tablet */
  @media (min-width: 769px) and (max-width: 1024px) {
    #banner img {
      max-height: 600px; /* กำหนดความสูงพอดีกับหน้าจอขนาดกลาง */
    }
  }

@media (max-width: 768px) {
      .hero-button {
        font-size: 1.1rem !important; /* ขนาดที่เล็กลงสำหรับหน้าจอเล็ก */
    }
}


    /* Add animation classes */
    .animate-float {
        animation: float 6s ease-in-out infinite;
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
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
  
    .glass-card {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border: 2px solid rgba(2, 2, 2, 0.658);
    }

    .static-card{
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border: 2px solid #000000; /* เพิ่มความหนาของขอบและตั้งสีเป็นสีเทาเข้ม */
        border-radius: 8px;
        padding: 1rem;
        text-align: center;
        width: 88%;
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

    .gradient-text {
        background: linear-gradient(to right, #8243FF, #36137B); /* กำหนดสีไล่เฉด */
        -webkit-background-clip: text; /* ใช้พื้นหลังเป็นข้อความ */
        color: transparent; /* ทำให้ข้อความโปร่งแสง */
    }

    .gradientYellow-text{
        background: linear-gradient(90deg, #FFD166, #FB974F); /* ไล่เฉดสี */
        -webkit-background-clip: text; /* ใช้กับข้อความ */
        -webkit-text-fill-color: transparent; /* ทำให้พื้นหลังโปร่งใส */
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

/* From Uiverse.io by ammarsaa */ 
.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 350px;
  padding: 20px;
  border-radius: 20px;
  position: relative;
  background-color: #ffffff;
  color: #000000;
  border: 1px solid #333;
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
.card {
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

.card::before {
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

.card::after {
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

.card .image {
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

.card .heading {
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

.card .icons {
  display: flex;
  gap: var(--unit);
}

.card .icons a {
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  
  color: var(--lightgray);
  padding: calc(var(--unit) / 2);
  border-radius: calc(var(--unit) / 2);
}

.card .icons a:hover {
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

  .arrow-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.chevron {
  width: 2rem;
  height: 1rem;
  position: relative;
  transform: rotate(-90deg); /* หมุนลูกศรให้หันขวา */
  animation: move-chevron 1.5s infinite ease-in-out; /* เพิ่มแอนิเมชัน */
  
}

.chevron:before,
.chevron:after {
  content: '';
  position: absolute;
  width: 50%;
  height: 100%;
  background-color: #81b3e6;
}

.chevron:before {
  left: 0;
  transform: skewY(30deg);
}

.chevron:after {
  right: 0;
  transform: skewY(-30deg);
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
  .arrow-container {
    display: none;
  }
}
</style>

<svelte:head>
  <title>บริการออกแบบเว็บไซต์ | HighHope Soft</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="บริการออกแบบและพัฒนาเว็บไซต์ระดับมืออาชีพ ด้วยทีมงานที่มีประสบการณ์" />
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
    srcset="/Pic_HH/banner-1.jpg 1920w, /Pic_HH/banner1-.jpg 1640w, /Pic_HH/banner1-.jpg 768w" 
    sizes="(max-width: 768px) 100vw, (max-width: 1920px) 100vw" 
    alt="Website Banner">
</section>

<!-- Hero Section with Improved Animation -->
<section id="home">
  
<!-- Row 2: Service Cards -->
<div class="flex flex-col mx-auto">
  <div class="services w-full flex flex-col overflow-x-auto mt-10 md:mt-3">
    <div class=" flex flex-row justify-between ">
      <!-- Service 1 -->
      <div class="services-card flex-1 min-w-[200px] bg-white shadow-lg rounded-lg p-3 hover:shadow-xl transition-shadow">
        <img 
          src="/Pic_HH/heart.png"
          alt="Service Icon" 
          class="w-12 h-12 mx-auto mb-4"
        />
        <p class="text-l font-semibold text-gray-700 text-center">
          ออกแบบตรงใจ<br>ตามต้องการ
        </p>
      </div>

      <!-- Service 2 -->
      <div class="services-card flex-1 min-w-[200px] bg-white shadow-lg rounded-lg p-3 hover:shadow-xl transition-shadow">
        <img 
          src="/Pic_HH/coin.png"
          alt="Service Icon" 
          class="w-12 h-12 mx-auto mb-4"
        />
        <p class="text-l font-semibold text-gray-700 text-center">
          ปรึกษาฟรี<br>ไม่มีค่าใช้จ่าย
        </p>
      </div>

      <!-- Service 3 -->
      <div class="services-card flex-1 min-w-[200px] bg-white shadow-lg rounded-lg p-3 hover:shadow-xl transition-shadow">
        <img 
          src="/Pic_HH/connection.png"
          alt="Service Icon" 
          class="w-12 h-12 mx-auto mb-4"
        />
        <p class="text-l font-semibold text-gray-700 text-center">
          ใช้งานได้ทั้งมือถือ<br>และคอมพิวเตอร์
        </p>
      </div>
    </div>
  </div>
    </div>
</section>


<!-- Services Section with Glass Effect -->
<section id="services" class="py-20 bg-gradient-to-b from-gray-50 to-white" >
    <div class="container mx-auto px-4 md:px-8">
        <h2 class="text-4xl md:text-5xl font-bold text-left mb-3 gradientYellow-text"
            in:fly="{{ y: 50, duration: 1000 }}">
            บริการรับทำเว็บไซต์แบบ Static Website
        </h2>
        <p class="mb-8 text-gray-600">
            สร้างเว็บไซต์สวยงาม เรียบง่าย เหมาะสำหรับธุรกิจที่ต้องการความชัดเจน
        </p>
        <div class="relative inline-block mb-10">
            <h2 class="text-xl md:text-2xl  text-left  font-bold">
                ทำไมถึงต้องเลือกทำ Static Web ?
            </h2>
            <div class="absolute left-0  w-full h-1 rounded-full" 
                 style="background: linear-gradient(90deg, #FFD166, #FB974F);"></div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 ">
            {#each services as service, i}
                <!-- 1 -->
                <div class="static-card glass-card rounded-xl p-8 shadow-lg mx-auto"
                     in:fly="{{ y: 50, duration: 1000, delay: i * 200 }}">
                    <h1 class="text-2xl  font-bold">โหลดเร็ว</h1>
                    <img src="/Pic_HH/fast.png" alt="fastload" class="w-full h-full">
                    <p class="text-gray-600">
                        เว็บไซต์แบบ Static ใช้ทรัพยากรน้อย<br>จึงโหลดได้อย่างรวดเร็ว ตอบโจทย์ผุ้ใช้งาน ที่ต้องการเข้าถึงข้อมูลอย่างรวดเร็ว
                    </p>
                </div>
                <!-- 2 -->
                <div class="static-card glass-card rounded-xl p-8 shadow-lg mx-auto"
                    in:fly="{{ y: 50, duration: 1000, delay: i * 200 }}">
                <h1 class="text-2xl  font-bold">ความปลอดภัยสูง</h1>
                <img src="/Pic_HH/shield.png" alt="fastload" class="w-full h-full">
                <p class="text-gray-600">
                    ไม่มีระบบฐานข้อมูลหรือการโต้ตอบที่<br>ซับซ้อน ลดความเสี่ยงจากการถูกโจมตี
                </p>
                </div>
                <!-- 3 -->
                <div class="static-card glass-card rounded-xl p-8 shadow-lg mx-auto"
                    in:fly="{{ y: 50, duration: 1000, delay: i * 200 }}">
                <h1 class="text-2xl  font-bold">ประหยัดค่าใช้จ่าย</h1>
                <img src="/Pic_HH/coin.png" alt="fastload" class="w-full h-full">
                <p class="text-gray-600">
                    ค่าใช้จ่ายในการพัฒนาและดูแลรักษาต่ำ 
                    เหมาะสำหรับธุรกิจขนาดเล็กหรือผู้เริ่มต้น
                </p>
                </div>
                <!-- 4 -->
                <div class="static-card glass-card rounded-xl p-8 shadow-lg mx-auto"
                    in:fly="{{ y: 50, duration: 1000, delay: i * 200 }}">
                <h1 class="text-2xl font-bold">ใช้งานง่าย</h1>
                <img src="/Pic_HH/like.png" alt="fastload" class="w-full h-full">
                <p class="text-gray-600">
                    เหมาะสำหรับการแสดงข้อมูล เช่น แนะนำธุรกิจ รายละเอียดสินค้า/บริการ หรือข้อมูลติดต่อ
                </p>
                </div>
            {/each}
        </div>
    </div> 
    
    
    <div class="container mx-auto px-4 md:px-8">
      <div class="relative inline-block mb-10 mt-11">
        <h2 class="text-2xl  text-left  font-bold ">
            เลือกแพ็กเกจที่เหมาะกับคุณ
        </h2>
        <div class="absolute left-0  w-full h-1 rounded-full" 
             style="background: linear-gradient(90deg, #FFD166, #FB974F);"></div>
      </div>
      <div class="flex flex-wrap justify-center gap-4">
      <!-- การ์ดใบที่ 1 -->
<div class="card-price max-w-sm lg:max-w-none mx-auto pt-10 px-5 pb-8 bg-gradient-to-r from-black to-gray-800 rounded-3xl">
  <div class="text-center mb-6">
    <h5 class="text-2xl font-semibold text-white mb-3">Basic</h5>
    <span class="block text-5xl font-bold text-white mb-3">2,900 บาท</span>
    <span class="block text-gray-200 font-medium mb-6"></span>
    <a
      href=""
      class="relative group inline-block w-full py-4 px-6 text-center text-black hover:text-gray-50 bg-green-500 font-semibold rounded-full overflow-hidden transition duration-200">
      <div
        class="absolute top-0 right-full w-full h-full bg-gray-900 transform group-hover:translate-x-full group-hover:scale-102 transition duration-500"></div>
      <span class="relative">ธุรกิจขนาดเล็กหรือผู้เริ่มต้น</span>
    </a>
  </div>
  <ul>
    <li class="mb-4">
      <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
      <span class="text-white">ออกแบบเว็บไซต์ฟรี !!</span>
    </li>
    <li class="mb-4">
      <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
      <span class="text-white">จำนวนหน้าเว็บไซต์ (1-2 หน้า)</span>
    </li>
    <li class="mb-4">
      <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
      <span class="text-white">
        รองรับทุกอุปกรณ์ คอมพิวเตอร์
        <span class="block pl-9">โทรศัพท์ แท็บเล็ต</span>
      </span>
    </li>
    
    <li class="mb-4">
      <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
      <span class="text-white">โฮสติ้งฟรี 1 ปี</span>
    </li>
    <li class="mb-4">
      <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
      <span class="text-white">จดโดเมน .com ฟรี 1 ปี</span>
    </li>
  </ul>
</div>

<!-- การ์ดใบที่ 2 -->
<div class="card-price max-w-sm lg:max-w-none mx-auto pt-10 px-5 pb-8 bg-gradient-to-r from-black to-gray-800 rounded-3xl">
  <div class="text-center mb-6">
    <h5 class="text-2xl font-semibold text-white mb-3">Standard</h5>
    <span class="block text-5xl font-bold text-white mb-7">3,900 บาท</span>
    <a href="#"
       class="relative group inline-block w-full py-4 px-6 text-center text-black hover:text-gray-50 bg-green-500 font-semibold rounded-full overflow-hidden transition duration-200">
      <div class="absolute top-0 right-full w-full h-full bg-gray-900 transform group-hover:translate-x-full group-hover:scale-102 transition duration-500"></div>
      <span class="relative">ธุรกิจที่กำลังเติบโต</span>
    </a>
  </div>
  <ul>
    <li class="mb-4">
      <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
      <span class="text-white">ออกแบบเว็บไซต์ฟรี !!</span>
    </li>
    <li class="mb-4">
      <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
      <span class="text-white">จำนวนหน้าเว็บไซต์ (3-5 หน้า)</span>
    </li>
    <li class="mb-4">
      <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
      <span class="text-white">รองรับทุกอุปกรณ์ คอมพิวเตอร์
        <span class="block pl-9">โทรศัพท์ แท็บเล็ต</span>
      </span>
    </li>
    <li class="mb-4">
      <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
      <span class="text-white">โฮสติ้งฟรี 1 ปี</span>
    </li>
    <li class="mb-4">
      <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
      <span class="text-white">จดโดเมน .com ฟรี 1 ปี</span>
    </li>
  </ul>
</div>

<!-- การ์ดใบที่ 3 -->
<div class="card-price max-w-sm lg:max-w-none mx-auto pt-10 px-7 pb-8 bg-gradient-to-r from-black to-gray-800 rounded-3xl">
  <div class="text-center mb-6">
    <h5 class="text-2xl font-semibold text-white mb-3">Premium</h5>
    <span class="block text-5xl font-bold text-white mb-7">9,990 บาท</span>
    <a href="#"
       class="relative group inline-block w-full py-4 px-6 text-center text-black hover:text-gray-50 bg-green-500 font-semibold rounded-full overflow-hidden transition duration-200">
      <div class="absolute top-0 right-full w-full h-full bg-gray-900 transform group-hover:translate-x-full group-hover:scale-102 transition duration-500"></div>
      <span class="relative">ธุรกิจที่ต้องการความพรีเมียม</span>
    </a>
  </div>
  <ul>
    <li class="mb-4">
      <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
      <span class="text-white">ออกแบบเว็บไซต์ฟรี !!</span>
    </li>
    <li class="mb-4">
      <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
      <span class="text-white">จำนวนหน้าเว็บไซต์ (6-8 หน้า)</span>
    </li>
    <li class="mb-4">
      <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
      <span class="text-white">ฟีเจอร์เพิ่มเติม เช่น แบบฟอร์มติดต่อ</span>
    </li>
    <li class="mb-4">
      <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
      <span class="text-white">รองรับทุกอุปกรณ์ คอมพิวเตอร์
        <span class="block pl-9">โทรศัพท์ แท็บเล็ต</span>
      </span>
    </li>
    <li class="mb-4">
      <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
      <span class="text-white">โฮสติ้งฟรี 1 ปี</span>
    </li>
    <li class="mb-4">
      <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
      <span class="text-white">จดโดเมน .com ฟรี 1 ปี</span>
    </li>
    <li class="mb-4">
      <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
      <span class="text-white">การติดตั้ง SSL Certificate ฟรี</span>
    </li>
  </ul>
</div>

<!-- การ์ดใบที่ 4 -->
<div class="card-price max-w-sm lg:max-w-none mx-auto pt-10 px-10 pb-8 bg-gradient-to-r from-black to-gray-800 rounded-3xl">
  <div class="text-center mb-6">
    <h5 class="text-2xl font-semibold text-white mb-3">Enterprise</h5>
    <span class="block text-5xl font-bold text-white mb-7">19,000 บาท</span>
    <a href="#"
       class="relative group inline-block w-full py-4 px-6 text-center text-black hover:text-gray-50 bg-green-500 font-semibold rounded-full overflow-hidden transition duration-200">
      <div class="absolute top-0 right-full w-full h-full bg-gray-900 transform group-hover:translate-x-full group-hover:scale-102 transition duration-500"></div>
      <span class="relative">องค์กรหรือโปรเจกต์ขนาดใหญ่</span>
    </a>
  </div>
  <ul>
    <li class="mb-4">
      <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
      <span class="text-white">ออกแบบเว็บไซต์ฟรี !!</span>
    </li>
    <li class="mb-4">
      <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
      <span class="text-white">จำนวนหน้าเว็บไซต์ (10+ หน้า)</span>
    </li>
    <li class="mb-4">
      <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
      <span class="text-white">ระบบสมาชิกหรือระบบการจอง</span>
    </li>
    <li class="mb-4">
      <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
      <span class="text-white">ระบบจัดการหลังบ้าน</span>
    </li>
    <li class="mb-4">
      <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
      <span class="text-white">รองรับทุกอุปกรณ์ คอมพิวเตอร์
        <span class="block pl-9">โทรศัพท์ แท็บเล็ต</span>
      </span>
    </li>
    <li class="mb-4">
      <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
      <span class="text-white">โฮสติ้งฟรี 1 ปี</span>
    </li>
    <li class="mb-4">
      <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
      <span class="text-white">จดโดเมน .com ฟรี 1 ปี</span>
    </li>
    <li class="mb-4">
      <img src="\Pic_HH\icon-ok.png" alt="Custom Icon" class="w-6 h-6 inline-block mr-2">
      <span class="text-white">การติดตั้ง SSL Certificate ฟรี</span>
    </li>
  </ul>
</div>

    

</section>

<!-- ขั้นตอนการสั่งทำ -->
<section id="step">

  <div class="container mx-auto px-4 md:px-8 md:mb-4 mt-6">
    <h2 class=" text-3xl md:text-5xl font-bold text-left md:mb-3" style="font-family: 'Sarabun', sans-serif;">
      วิธีการทำเว็บไซต์กับเราง่ายมาก
    </h2>
    <button class="hero-button px-6 md:px-8 py-3 md:py-4 font-bold rounded-3xl 
                     shadow-lg hover:shadow-xl transition-all mt-4 md:mt-8 mb-5 text-black "
                  in:fly="{{ y: 50, duration: 1000, delay: 2000 }}">
      สั่งงานง่ายมีเพียง 4 ขั้นตอน !!
      <div class="hoverEffect">
        <div></div>
      </div>
    </button>

    <div class="flex items-center justify-center gap-6 bg-white">
      
      <!-- Card 1 -->
       
      <div class="static-card glass-card rounded-xl p-8 shadow-lg">
        <h1 class="text-2xl  font-bold mb-5">พูดคุยและวางแผน</h1>
        <img src="\Pic_HH\talk-2.png" alt="talk" class="w-full h-full mb-5">
        <p class="text-gray-600">
          ติดต่อเราเพื่อแจ้งรายละเอียดเว็บไซต์<br>
          ที่ต้องการ เช่น ประเภท, เนื้อหา<br>
          และดีไซน์ที่ชอบ
        </p>
      </div>

      <!-- Arrow -->
      <div class="arrow-container">
        <div class="chevron"></div>
      </div>

      <!-- Card 2 -->
      <div class="static-card glass-card rounded-xl p-8 shadow-lg">
        <h1 class="text-2xl  font-bold mb-5">เสนอราคาและเริ่มงาน</h1>
        <img src="\Pic_HH\coin.png" alt="coin" class="w-full h-full mb-5">
        <p class="text-gray-600">
          ทางเราจะประเมินราคาและ<br>
          แจ้งระยะเวลาในการทำงาน<br>
          ลูกค้าชำระมัดจำเพื่อเริ่มงานได้เลย<br>
        </p>
      </div>

      <!-- Arrow -->
      <div class="arrow-container">
        <div class="chevron"></div>
      </div>

      <!-- Card 3 -->
      <div class="static-card glass-card rounded-xl p-8 shadow-lg">
        <h1 class="text-2xl  font-bold mb-5">พัฒนาและตรวจสอบ</h1>
        <img src="\Pic_HH\man.png" alt="man" class="w-full h-full mb-5">
        <p class="text-gray-600">
          เราออกแบบและพัฒนาเว็บไซต์<br>
          พร้อมส่งให้ลูกค้าเพื่อตรวจสอบ<br>
          และแก้ไขได้หากมีข้อผิดพลาด<br>
        </p>
      </div>

      <!-- Arrow -->
      <div class="arrow-container">
        <div class="chevron"></div>
      </div>

      <!-- Card 4 -->
      <div class="static-card glass-card rounded-xl p-8 shadow-lg">
        <h1 class="text-2xl  font-bold mb-5">ส่งมอบเว็บไซต์</h1>
        <img src="\Pic_HH\png_xmz7g.png" alt="hand" class="w-full h-full mb-5">
        <p class="text-gray-600">
          อับโหลดเว็บไซต์ให้พร้อมใช้งาน<br>
          สามารถใช้งานเว็บไซต์ได้เลย<br>
          และบริการหลังการขายเบื้องต้น<br>
        </p>
      </div>
    </div>
  </div>
</section>


<section id="contact" class="py-20 bg-white" style="background-image: url('/Pic_HH/bg-3.jpg'); background-size: cover; background-position: center;">
  <div class="container mx-auto px-4 md:px-8">
    <h2 class="text-4xl md:text-5xl font-bold text-left mb-12 ">ช่องทางการติดต่อ</h2>
    <div class="flex flex-wrap lg:flex-nowrap gap-8">
      <!-- Left Section -->
      <div class="w-full lg:w-1/2 space-y-8">
        
        <!-- Card Section -->
        <div class="card md:mt-11 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 mx-auto">
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
      <form class="w-full lg:w-1/2 bg-gray-50 p-8 rounded-lg shadow-lg">
        <p class="title text-2xl font-bold mb-4">ส่งข้อมูล</p>
        <p class="message mb-8">ทางทีมงานจะตอบกลับภายในระยะเวลา 24 ชม.</p>
        <label class="block mb-4">
          <span class="block text-gray-600 mt-2 mb-2">ชื่อ</span>
          <input class="input w-full p-3 border border-gray-300 rounded" type="name" placeholder="" required>
        </label>
        <label class="block mb-4">
          <span class="block text-gray-600 mt-2 mb-2">อีเมล</span>
          <input class="input w-full p-3 border border-gray-300 rounded" type="email" placeholder="" required>
        </label>
        <label class="block mb-4">
          <span class="block text-gray-600 mt-2 mb-2">หมายเลขโทรศัพท์</span>
          <input class="input w-full p-3 border border-gray-300 rounded" type="phonenumber" placeholder="" required>
        </label>
        <label class="block mb-4">
          <span class="block text-gray-600 mt-2 mb-2">ข้อความ</span>
          <textarea class="input w-full p-3 border border-gray-300 rounded" placeholder="" required></textarea>
        </label>
        <button class="submit bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">ส่งข้อมูล</button>
      </form>
    </div>
  </div>
</section>


















