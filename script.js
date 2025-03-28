const { createApp } = Vue;

createApp({
  data() {
    return {
      volunteers: [],
      searchQuery: '',
      sortField: 'place',
      sortDirection: 'asc',
      lastScrollPosition: 0,
      parallaxIntensity: 0.1
    }
  },
  computed: {
    filteredVolunteers() {
      let result = this.volunteers;
      
      // Фильтрация
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(v => 
          v.name.toLowerCase().includes(query)
        );
      }
      
      // Сортировка
      return result.sort((a, b) => a.place - b.place);
    }
  },
  methods: {
    async fetchData() {
      try {
        const response = await fetch('data.json?v=' + new Date().getTime());
        if (!response.ok) throw new Error('Ошибка загрузки');
        const data = await response.json();
        
        // Преобразование типов данных
        this.volunteers = data.map(item => ({
          name: String(item.name),
          events: Number(item.events) || 0,
          points: Number(item.points) || 0,
          place: Number(item.place) || 0
        }));
        
      } catch (error) {
        console.error('Ошибка:', error);
        // Можно добавить уведомление для пользователя
      }
    },
    
    handleScroll() {
      const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      const tableContainer = document.querySelector('.table-container');
      
      if (tableContainer) {
        // Параллакс-эффект
        const offset = currentScrollPosition * this.parallaxIntensity;
        tableContainer.style.transform = `translateY(${offset}px)`;
        
        // Параллакс для звезд фона
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
          const speed = 0.2 + (index * 0.05);
          star.style.transform = `translateY(${currentScrollPosition * speed * 0.3}px) translateX(${currentScrollPosition * speed * 0.1}px)`;
        });
      }
      
      this.lastScrollPosition = currentScrollPosition;
    }
  },
  mounted() {
    this.fetchData();
    
    // Обновление каждые 5 минут
    setInterval(this.fetchData, 300000);
    
    // Инициализация параллакс-эффекта
    window.addEventListener('scroll', this.handleScroll);
    
    // Создание звезд для параллакса
    this.createStars();
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  
  createStars() {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars-parallax';
    document.body.appendChild(starsContainer);
    
    // Создаем 30 звезд с разными размерами и позициями
    for (let i = 0; i < 30; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      // Случайные параметры для звезд
      const size = Math.random() * 3 + 1;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const opacity = Math.random() * 0.5 + 0.3;
      const animationDelay = Math.random() * 5;
      
      star.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${posX}%;
        top: ${posY}%;
        opacity: ${opacity};
        animation-delay: ${animationDelay}s;
      `;
      
      starsContainer.appendChild(star);
    }
  }
}).mount('#app');
