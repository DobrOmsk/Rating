const { createApp } = Vue;

createApp({
  data() {
    return {
      volunteers: [],
      searchQuery: '',
      sortField: 'place',
      sortDirection: 'asc'
    }
  },
  computed: {
    filteredVolunteers() {
      let result = this.volunteers;
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(v => 
          v.name.toLowerCase().includes(query)
        );
      }
      
      return result.sort((a, b) => a.place - b.place);
    }
  },
  methods: {
    async fetchData() {
      try {
        const response = await fetch('data.json?v=' + new Date().getTime());
        if (!response.ok) throw new Error('Ошибка загрузки');
        const data = await response.json();
        
        this.volunteers = data.map(item => ({
          name: String(item.name),
          events: Number(item.events) || 0,
          points: Number(item.points) || 0,
          place: Number(item.place) || 0
        }));
        
      } catch (error) {
        console.error('Ошибка:', error);
      }
    },
    
    initParallax() {
      // Более безопасная реализация параллакса
      const tableContainer = document.querySelector('.table-container');
      if (!tableContainer) return;
      
      const parallax = () => {
        const scrollY = window.scrollY || window.pageYOffset;
        tableContainer.style.transform = `translateY(${scrollY * 0.1}px)`;
        requestAnimationFrame(parallax);
      };
      
      parallax();
    }
  },
  mounted() {
    this.fetchData();
    setInterval(this.fetchData, 300000);
    
    // Инициализируем параллакс после небольшой задержки
    setTimeout(() => {
      this.initParallax();
    }, 500);
  }
}).mount('#app');
