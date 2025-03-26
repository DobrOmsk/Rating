const { createApp } = Vue;

createApp({
  data() {
    return {
      volunteers: [],
      searchQuery: '',
      sortField: 'points',
      sortDirection: 'desc'
    }
  },
  computed: {
    filteredVolunteers() {
      let result = this.volunteers;
      
      // Фильтрация
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(v => v.name.toLowerCase().includes(query));
      }
      
      // Сортировка
      return result.sort((a, b) => {
        if (a[this.sortField] > b[this.sortField]) 
          return this.sortDirection === 'asc' ? 1 : -1;
        if (a[this.sortField] < b[this.sortField]) 
          return this.sortDirection === 'asc' ? -1 : 1;
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
    },
    async fetchData() {
      // Загрузка данных из data.json (который обновляется через GitHub Actions)
      const response = await fetch('data.json');
      this.volunteers = await response.json();
    }
  },
  mounted() {
    this.fetchData();
  }
}).mount('#app');
