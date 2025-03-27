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
    }
  },
  mounted() {
    this.fetchData();
    // Обновление каждые 5 минут
    setInterval(this.fetchData, 300000);
  }
}).mount('#app');
