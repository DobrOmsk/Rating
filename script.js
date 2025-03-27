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
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(v => v.name.toLowerCase().includes(query));
      }
      
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
      try {
        const response = await fetch('data.json?v=' + new Date().getTime());
        if (!response.ok) throw new Error('Ошибка загрузки');
        this.volunteers = await response.json();
      } catch (error) {
        console.error('Ошибка:', error);
      }
    }
  },
  mounted() {
    this.fetchData();
    // Автообновление каждые 5 минут
    setInterval(this.fetchData, 300000);
  }
}).mount('#app');
