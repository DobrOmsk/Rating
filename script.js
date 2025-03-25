const { createApp } = Vue;

createApp({
  data() {
    return {
      volunteers: [],
      searchQuery: '',
      sortField: 'points',
      sortDirection: 'desc',
      lastUpdated: new Date().toLocaleString()
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
      return result.sort((a, b) => {
        const field = this.sortField;
        if (a[field] > b[field]) return this.sortDirection === 'asc' ? 1 : -1;
        if (a[field] < b[field]) return this.sortDirection === 'asc' ? -1 : 1;
        return 0;
      });
    }
  },
  methods: {
    sortBy(field) {
      if (this.sortField === field) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortField = field;
        this.sortDirection = 'desc';
      }
    }
  },
  mounted() {
    // Загрузка данных
    fetch('data.json')
      .then(response => response.json())
      .then(data => {
        this.volunteers = data;
        this.lastUpdated = new Date().toLocaleString();
      })
      .catch(error => {
        console.error('Ошибка загрузки данных:', error);
      });
  }
}).mount('#app');
