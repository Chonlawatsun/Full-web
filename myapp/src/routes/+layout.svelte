<script>
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { fly } from 'svelte/transition';
  import '../app.css';

  let mounted = false;
  let isMenuOpen = false;
  let prevScrollPos = 0;
  let isNavVisible = true;
  let isScrolled = false;

  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
  };

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    isNavVisible = prevScrollPos > currentScrollPos || currentScrollPos < 50;
    isScrolled = currentScrollPos > 50;
    prevScrollPos = currentScrollPos;
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      if (isMenuOpen) isMenuOpen = false;
    }
  };

  onMount(() => {
    mounted = true;
    window.addEventListener('scroll', handleScroll);

    gsap.from('.nav-item', {
      duration: 0.7,
      y: -30,
      opacity: 0,
      stagger: 0.1,
      ease: 'elastic.out(1, 0.8)'
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<style>
  :global(*) {
    ::selection {
      background-color: rgba(255, 215, 0, 0.3);
      color: #FFD700;
    }
    font-family: 'Kanit', sans-serif !important;
  }

  .nav-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    transform: translateY(0);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .nav-hidden {
    transform: translateY(-100%);
  }

  nav {
    background: linear-gradient(
      90deg, 
      rgba(0, 0, 0, 0.95) 0%,
      rgba(28, 28, 28, 0.95) 50%,
      rgba(0, 0, 0, 0.95) 100%
    );
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    transition: all 0.3s ease;
  }

  .nav-scrolled {
    background: linear-gradient(
      90deg,
      rgba(18, 18, 18, 0.98) 0%,
      rgba(38, 38, 38, 0.98) 50%,
      rgba(18, 18, 18, 0.98) 100%
    );
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
  }

  .nav-link {
    position: relative;
    transition: all 0.3s ease;
    color: white !important;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
  }

  .nav-link::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: -2px;
    left: 0;
    background: linear-gradient(
      to right,
      transparent,
      #FFD700,
      #FFA500,
      transparent
    );
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease;
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  }

  .nav-link:hover::before {
    transform: scaleX(1);
    transform-origin: left;
  }

  .nav-link:hover {
    transform: translateY(-2px);
    color: #FFD700 !important;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
  }

  .logo-text {
    background: linear-gradient(to right, #FFD700, #FFA500);
    -webkit-background-clip: text;
    color: transparent;
    font-weight: 700;
    margin-left: 1rem;
    font-size: 1.5rem;
    text-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
  }

  @media (max-width: 768px) {
    .logo-text {
      font-size: 1.25rem;
    }
  }

  .logo-hover {
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
  }

  .logo-hover:hover img {
    transform: scale(1.1);
    filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.3));
  }

  .mobile-menu {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: linear-gradient(
      180deg,
      rgba(18, 18, 18, 0.98) 0%,
      rgba(28, 28, 28, 0.98) 100%
    );
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .mobile-link {
    color: white !important;
    font-weight: 500;
    padding: 1rem 1.5rem;
    display: block;
    transition: all 0.3s ease;
    border-left: 3px solid transparent;
  }

  .mobile-link:hover {
    background: linear-gradient(
      to right,
      rgba(255, 215, 0, 0.1),
      transparent
    );
    padding-left: 2rem;
    color: #FFD700 !important;
    border-left: 3px solid #FFD700;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
  }

  .menu-button {
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .menu-button:hover {
    color: #FFD700;
    transform: scale(1.1);
  }

  .menu-button::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle,
      rgba(255, 215, 0, 0.2) 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .menu-button:hover::after {
    opacity: 1;
  }
</style>

<svelte:head>
  <title>บริการออกแบบเว็บไซต์ | HighHope Soft</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="บริการออกแบบและพัฒนาเว็บไซต์ระดับมืออาชีพ ด้วยทีมงานที่มีประสบการณ์" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

{#if mounted}
  <div class="nav-container {!isNavVisible ? 'nav-hidden' : ''} {isScrolled ? 'nav-scrolled' : ''}">
    <nav class="py-3 px-4 lg:px-8">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <!-- Logo -->
        <a href="/" class="logo-hover">
          <img
            src="/Pic_HH/LogoFullweb1.png"
            alt="Full Web Logo"
            class="h-8 w-auto sm:h-10 transition-transform duration-300"
          />
          <span class="logo-text  sm:inline">FULL WEB</span>
        </a>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-6">
          {#each [
            { href: '#home', text: 'หน้าแรก' },
            { href: '#services', text: 'บริการ' },
            { href: '#portfolio', text: 'ราคาแพ็กเกจ' },
            { href: '#step', text: 'ขั้นตอนการสั่งทำ' },
            { href: '#contact', text: 'ติดต่อ' }
            
          ] as { href, text }}
            <a
              href={href}
              class="nav-link nav-item text-sm lg:text-base"
              on:click|preventDefault={() => scrollToSection(href.substring(1))}
            >
              {text}
            </a>
          {/each}
        </div>

        <!-- Mobile Menu Button -->
        <button
          class="menu-button md:hidden p-2 rounded-lg text-white focus:outline-none"
          on:click={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            class="w-6 h-6 transition-transform duration-300"
            class:rotate-180={isMenuOpen}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {#if isMenuOpen}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            {:else}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            {/if}
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      {#if isMenuOpen}
        <div
          transition:fly={{ y: -20, duration: 300 }}
          class="mobile-menu md:hidden"
        >
          {#each [
            { href: '#home', text: 'หน้าแรก' },
            { href: '#services', text: 'บริการ' },
            { href: '#portfolio', text: 'ราคาแพ็กเกจ' },
            { href: '#step', text: 'ขั้นตอนการสั่งทำ' },
            { href: '#contact', text: 'ติดต่อ' }
          ] as { href, text }}
            <a
              href={href}
              class="mobile-link"
              on:click|preventDefault={() => {
                scrollToSection(href.substring(1));
                isMenuOpen = false;
              }}
            >
              {text}
            </a>
          {/each}
        </div>
      {/if}
    </nav>
  </div>

  <main class="pt-16">
    <slot />
  </main>
{/if}