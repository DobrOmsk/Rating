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
      
      return result.sort((a, b) => {
        if (a[this.sortField] > b[this.sortField]) {
          return this.sortDirection === 'asc' ? 1 : -1;
        }
        if (a[this.sortField] < b[this.sortField]) {
          return this.sortDirection === 'asc' ? -1 : 1;
        }
        return 0;
      });
    }
  },
  methods: {
    async fetchData() {
      try {
        const response = await fetch('data.json?v=' + new Date().getTime());
        this.volunteers = await response.json();
        
        // Форматирование чисел
        this.volunteers.forEach(v => {
          v.points = Number(v.points) || 0;
          v.events = Number(v.events) || 0;
          v.place = Number(v.place) || 0;
        });
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    }
  },
  mounted() {
    this.fetchData();
    setInterval(this.fetchData, 300000); // Обновление каждые 5 минут
  }
}).mount('#app');
