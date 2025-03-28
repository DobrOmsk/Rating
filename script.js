const { createApp } = Vue;

createApp({
  data() {
    return {
      volunteers: [],
      searchQuery: '',
      sortField: 'place',
      sortDirection: 'asc',
      visibleCount: 50, // Начальное количество отображаемых записей
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
      
      // Фильтрация
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(v => 
          v.name.toLowerCase().includes(query)
        );
      }
      
      // Сортировка
      return result.sort((a, b) => a.place - b.place);
    },
    visibleVolunteers() {
      // Возвращаем только видимую часть данных
      return this.filteredVolunteers.slice(0, this.visibleCount);
    },
    hasMoreToShow() {
      // Проверяем, есть ли еще записи для отображения
      return this.visibleCount < this.filteredVolunteers.length;
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
      }
    },
    showMore() {
      // Увеличиваем количество отображаемых записей
      this.visibleCount += 50;
    }
  },
  mounted() {
    this.fetchData();
    // Обновление каждые 5 минут
    setInterval(this.fetchData, 300000);
  }
}).mount('#app');
