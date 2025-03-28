const { createApp } = Vue;

createApp({
  data() {
    return {
      volunteers: [],
      searchQuery: '',
      sortField: 'place',
      sortDirection: 'asc',
      visibleCount: 50, // Показываем первые 50 записей
      contacts: {
        organization: "Ресурсный центр развития добровольчества Омской области",
        address: "г. Омск, ул. Примерная, 123",
        phone: "+7 (3812) 12-34-56",
        email: "volunteer@omsk.ru",
        website: "www.omsk-volunteer.ru"
      }
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
    },
    visibleVolunteers() {
      return this.filteredVolunteers.slice(0, this.visibleCount);
    },
    hasMoreToShow() {
      return this.visibleCount < this.filteredVolunteers.length;
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
    showMore() {
      this.visibleCount += 50; // Показываем еще 50 записей
    }
  },
  mounted() {
    this.fetchData();
    setInterval(this.fetchData, 300000);
  }
}).mount('#app');
