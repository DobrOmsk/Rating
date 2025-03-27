const { createApp } = Vue;

createApp({
  data() {
    return {
      volunteers: [],
      searchQuery: '',
      sortField: 'place',  // Сортировка по месту по умолчанию
      sortDirection: 'asc' // По возрастанию (1, 2, 3...)
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
      
      // Автоматическая сортировка по месту
      return result.sort((a, b) => {
        if (a.place > b.place) return 1;
        if (a.place < b.place) return -1;
        return 0;
      });
    }
  },
  methods: {
    async fetchData() {
      try {
        const response = await fetch('data.json?v=' + new Date().getTime());
        this.volunteers = await response.json();
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    }
  },
  mounted() {
    this.fetchData();
    // Автообновление каждые 5 минут
    setInterval(this.fetchData, 300000);
  }
}).mount('#app');
